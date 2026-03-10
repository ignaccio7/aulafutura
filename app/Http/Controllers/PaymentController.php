<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Membership;
use App\Models\SubscriptionPlan;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use MercadoPago\MercadoPagoConfig;
use MercadoPago\Client\Preference\PreferenceClient;
use MercadoPago\Client\Payment\PaymentClient;

class PaymentController extends Controller
{
    private function configureMP(): void
    {
        MercadoPagoConfig::setAccessToken(config('services.mercadopago.access_token'));
    }

    public function show(string $slug)
    {
        $plan = SubscriptionPlan::active()
            ->where('slug', $slug)
            ->firstOrFail();

        return Inertia::render('cardPayment', [
            'plan'      => $plan,
            'publicKey' => config('services.mercadopago.public_key'),
        ]);
    }

    public function createPreference(Request $request)
    {
        $request->validate([
            'plan_slug'            => 'required|string',
            'name'                 => 'required|string|max:255',
            'email'                => 'required|email|unique:users,email',
            'password'             => 'required|string|min:8|confirmed',
        ]);

        $plan = SubscriptionPlan::active()
            ->where('slug', $request->plan_slug)
            ->firstOrFail();

        $this->configureMP();

        $price = round((float)($plan->discount_price ?? $plan->price), 2);

        $preferenceData = [
            'items' => [
                [
                    'title'       => "Plan {$plan->name}",
                    'quantity'    => 1,
                    'unit_price'  => $price,
                    'currency_id' => 'ARS', // token argentino → ARS para pruebas
                    // cuando tengas token peruano → cambiar a PEN
                ]
            ],
            'payer' => [
                'email' => $request->email,
            ],
            'metadata' => [
                'plan_id'  => $plan->id,
                'name'     => $request->name,
                'email'    => $request->email,
                'password' => bcrypt($request->password),
            ],
            'back_urls' => [
                'success' => route('payment.success'),
                'failure' => route('payment.failure'),
                'pending' => route('payment.pending'),
            ],
            // 'auto_return' => 'approved',
        ];

        if (app()->environment('production')) {
            $preferenceData['auto_return'] = 'approved';
        }

        Log::info('MP Preference data enviada:', $preferenceData);

        try {
            $client     = new PreferenceClient();
            $preference = $client->create($preferenceData);

            Log::info('MP Preference creada OK:', ['id' => $preference->id]);

            $url = config('services.mercadopago.mode') === 'sandbox'
                ? $preference->sandbox_init_point
                : $preference->init_point;

            // return redirect()->away($url);
            return response()->json(['url' => $url]);
        } catch (\MercadoPago\Exceptions\MPApiException $e) {

            // Ver el detalle real del error de MP
            $apiResponse = $e->getApiResponse();
            Log::error('MP API Error detallado:', [
                'status_code' => $e->getStatusCode(),
                'message'     => $e->getMessage(),
                'response'    => method_exists($apiResponse, 'getContent')
                    ? $apiResponse->getContent()
                    : (array) $apiResponse,
            ]);

            // Con Inertia, los errores se devuelven así
            return redirect()->back()->withErrors([
                'payment' => 'Error al crear el pago. Código: ' . $e->getStatusCode()
            ])->withInput();
        }
    }

    public function success(Request $request)
    {
        $paymentId    = $request->query('payment_id');
        $preferenceId = $request->query('preference_id');
        $status       = $request->query('status');

        Log::info('MP Success callback:', [
            'payment_id' => $paymentId,
            'status'     => $status,
        ]);

        if ($status !== 'approved' || !$paymentId) {
            return redirect()->route('payment.failure');
        }

        $this->configureMP();

        try {
            $client  = new PaymentClient();
            $payment = $client->get((int) $paymentId);

            Log::info('MP Payment verificado:', [
                'id'     => $payment->id,
                'status' => $payment->status,
            ]);

            if ($payment->status !== 'approved') {
                return redirect()->route('payment.failure');
            }

            $meta = $payment->metadata;
            $plan = SubscriptionPlan::findOrFail($meta->plan_id);

            DB::transaction(function () use ($meta, $plan, $paymentId, $preferenceId) {
                $user = User::firstOrCreate(
                    ['email' => $meta->email],
                    [
                        'name'      => $meta->name,
                        'password'  => $meta->password, // ya viene hasheada
                        'role_id'   => 2,
                        'is_active' => true,
                    ]
                );

                Membership::create([
                    'user_id'          => $user->id,
                    'plan_id'          => $plan->id,
                    'start_date'       => now(),
                    'end_date'         => now()->addDays($plan->duration_days),
                    'status'           => 'active',
                    'mp_payment_id'    => (string) $paymentId,
                    'mp_preference_id' => $preferenceId,
                ]);

                Auth::login($user);
            });

            return redirect()->route('dashboard')
                ->with('success', "¡Bienvenido! Tu plan {$plan->name} está activo.");
        } catch (\Exception $e) {
            Log::error('Error en success callback:', [
                'message' => $e->getMessage(),
                'trace'   => $e->getTraceAsString(),
            ]);

            return redirect()->route('payment.failure');
        }
    }

    public function failure(Request $request)
    {
        return Inertia::render('PaymentResult', [
            'status'  => 'failure',
            'message' => 'El pago no pudo completarse. Puedes intentarlo nuevamente.',
        ]);
    }

    public function pending(Request $request)
    {
        return Inertia::render('PaymentResult', [
            'status'  => 'pending',
            'message' => 'Tu pago está pendiente de confirmación. Te avisaremos por email.',
        ]);
    }
}
