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
            'plan_slug'   => 'required|string',
            'name'        => 'required|string|max:255',
            'email'       => 'required|email|unique:users,email',
            'password'    => 'required|string|min:8|confirmed',
        ], [
            'name.required'        => 'El nombre es requerido.',
            'email.required'       => 'El correo electrónico es requerido.',
            'email.email'          => 'El correo no tiene un formato válido.',
            'email.unique'         => 'Este correo ya está registrado. ¿Ya tienes cuenta?',
            'password.required'    => 'La contraseña es requerida.',
            'password.min'         => 'La contraseña debe tener al menos 8 caracteres.',
            'password.confirmed'   => 'Las contraseñas no coinciden.',
            'plan_slug.required'   => 'No se especificó el plan.',
        ]);
        $plan = SubscriptionPlan::active()
            ->where('slug', $request->plan_slug)
            ->firstOrFail();

        $this->configureMP();

        $price = round((float)($plan->discount_price ?? $plan->price), 2);

        // ← Guardamos los datos en sesión ANTES de ir a MP
        session([
            'mp_pending_user' => [
                'plan_id'  => $plan->id,
                'name'     => $request->name,
                'email'    => $request->email,
                'password' => bcrypt($request->password),
            ]
        ]);

        $preferenceData = [
            'items' => [
                [
                    'title'       => "Plan {$plan->name}",
                    'quantity'    => 1,
                    'unit_price'  => $price,
                    'currency_id' => 'ARS',
                ]
            ],
            'payer' => [
                'email' => $request->email,
            ],
            'back_urls' => [
                'success' => route('payment.success'),
                'failure' => route('payment.failure'),
                'pending' => route('payment.pending'),
            ],
            'payment_methods' => [
                'installments' => 1,
            ],
        ];

        if (!str_contains(config('app.url'), 'localhost')) {
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

            return response()->json(['url' => $url]);
        } catch (\MercadoPago\Exceptions\MPApiException $e) {
            $apiResponse = $e->getApiResponse();
            Log::error('MP API Error:', [
                'status_code' => $e->getStatusCode(),
                'response'    => method_exists($apiResponse, 'getContent')
                    ? $apiResponse->getContent()
                    : (array) $apiResponse,
            ]);

            return response()->json([
                'message' => 'Error al crear el pago. Código: ' . $e->getStatusCode()
            ], 500);
        }
    }

    public function success(Request $request)
    {
        $paymentId    = $request->query('payment_id');
        $preferenceId = $request->query('preference_id');
        $status       = $request->query('status');

        Log::info('MP Success callback:', $request->query());

        if ($status !== 'approved' || !$paymentId) {
            return redirect()->route('payment.failure');
        }

        // ← Recuperamos los datos de la sesión
        $pendingUser = session('mp_pending_user');

        Log::info('Sesión mp_pending_user:', $pendingUser ?? []);

        if (empty($pendingUser)) {
            Log::error('No hay datos de usuario en sesión');
            return redirect()->route('payment.failure');
        }

        $this->configureMP();

        try {
            // Verificamos que el pago sea real en la API de MP
            $client  = new PaymentClient();
            $payment = $client->get((int) $paymentId);

            Log::info('MP Payment verificado:', [
                'id'     => $payment->id,
                'status' => $payment->status,
            ]);

            if ($payment->status !== 'approved') {
                return redirect()->route('payment.failure');
            }

            $plan = SubscriptionPlan::findOrFail($pendingUser['plan_id']);

            DB::transaction(function () use ($pendingUser, $plan, $paymentId, $preferenceId) {
                $user = User::firstOrCreate(
                    ['email' => $pendingUser['email']],
                    [
                        'name'      => $pendingUser['name'],
                        'password'  => $pendingUser['password'],
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

            // Limpiar la sesión después de usarla
            session()->forget('mp_pending_user');

            return redirect()->route('dashboard')
                ->with('success', "¡Bienvenido! Tu plan {$plan->name} está activo.");
        } catch (\Exception $e) {
            Log::error('Error en success:', [
                'message' => $e->getMessage(),
                'line'    => $e->getLine(),
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
