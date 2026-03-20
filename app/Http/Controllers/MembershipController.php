<?php

namespace App\Http\Controllers;

use App\Models\Membership;
use App\Models\SubscriptionPlan;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use MercadoPago\MercadoPagoConfig;
use MercadoPago\Client\Preference\PreferenceClient;
use MercadoPago\Client\Payment\PaymentClient;

class MembershipController extends Controller
{
    private function configureMP(): void
    {
        MercadoPagoConfig::setAccessToken(config('services.mercadopago.access_token'));
    }

    // ──────────────────────────────────────────────
    //  1. Usuario elige nuevo plan → crea preferencia
    //     en MP y redirige directo (ya está logueado)
    // ──────────────────────────────────────────────
    public function changePlan(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|exists:subscription_plans,id',
        ]);

        $user = $request->user();

        $plan = SubscriptionPlan::where('id', $request->plan_id)
            ->where('is_active', true)
            ->firstOrFail();

        // Evitar pagar si ya tiene este plan
        $current = $user->memberships()
            ->where('status', 'active')
            ->where('end_date', '>=', now())
            ->latest()
            ->first();

        if ($current && $current->plan_id === $plan->id) {
            return redirect()->back()->with('info', 'Ya tienes este plan activo.');
        }

        // Guardar en sesión: user + plan a activar tras el pago
        session([
            'mp_plan_change' => [
                'user_id' => $user->id,
                'plan_id' => $plan->id,
            ]
        ]);

        $this->configureMP();

        $price = round((float)($plan->discount_price ?? $plan->price), 2);

        $preferenceData = [
            'items' => [[
                'title'       => "Plan {$plan->name} - AulaFutura",
                'quantity'    => 1,
                'unit_price'  => $price,
                'currency_id' => $plan->currency ?? 'ARS',
            ]],
            'payer' => [
                'name'  => $user->name,
                'email' => $user->email,
            ],
            'back_urls' => [
                'success' => route('membership.change-plan.success'),
                'failure' => route('membership.change-plan.failure'),
                'pending' => route('membership.change-plan.pending'),
            ],
            'payment_methods' => [
                'installments' => 1,
            ],
        ];

        if (!str_contains(config('app.url'), 'localhost')) {
            $preferenceData['auto_return'] = 'approved';
        }

        Log::info('MP PlanChange - Preference enviada:', $preferenceData);

        try {
            $client     = new PreferenceClient();
            $preference = $client->create($preferenceData);

            $url = config('services.mercadopago.mode') === 'sandbox'
                ? $preference->sandbox_init_point
                : $preference->init_point;

            // Redirect directo — el usuario ya tiene sesión Laravel activa
            // return redirect($url);
            return response()->json(['url' => $url]);
        } catch (\MercadoPago\Exceptions\MPApiException $e) {
            Log::error('MP PlanChange - API Error:', ['status' => $e->getStatusCode()]);
            return redirect()->back()
                ->with('error', 'Error al conectar con Mercado Pago. Intenta nuevamente.');
        }
    }

    // ──────────────────────────────────────────────
    //  2. MP callback: pago aprobado
    //     Cancelar la vieja membresía + crear la nueva
    // ──────────────────────────────────────────────
    public function changePlanSuccess(Request $request)
    {
        $paymentId = $request->query('payment_id');
        $status    = $request->query('status');

        Log::info('MP PlanChange - Success callback:', $request->query());

        if ($status !== 'approved' || !$paymentId) {
            return redirect()->route('membership.change-plan.failure');
        }

        $pending = session('mp_plan_change');

        if (empty($pending)) {
            Log::error('MP PlanChange - Sesión vacía en success');
            return redirect()->route('user.planes')
                ->with('error', 'No se pudo confirmar el cambio. Contacta soporte.');
        }

        $this->configureMP();

        try {
            // Verificar el pago en la API de MP
            $client  = new PaymentClient();
            $payment = $client->get((int) $paymentId);

            if ($payment->status !== 'approved') {
                return redirect()->route('membership.change-plan.failure');
            }

            $plan = SubscriptionPlan::findOrFail($pending['plan_id']);
            $user = User::findOrFail($pending['user_id']);

            // 1. Cancelar membresía activa anterior
            $user->memberships()
                ->where('status', 'active')
                ->update(['status' => 'cancelled']);

            // 2. Crear la nueva membresía
            Membership::create([
                'user_id'    => $user->id,
                'plan_id'    => $plan->id,
                'start_date' => now()->toDateString(),
                'end_date'   => now()->addDays($plan->duration_days)->toDateString(),
                'status'     => 'active',
            ]);

            session()->forget('mp_plan_change');

            Log::info("MP PlanChange - OK: user={$user->id} nuevo plan={$plan->name}");

            return redirect()->route('user.dashboard')
                ->with('success', "¡Tu plan {$plan->name} está activo!");
        } catch (\Exception $e) {
            Log::error('MP PlanChange - Error en success:', [
                'message' => $e->getMessage(),
                'line'    => $e->getLine(),
            ]);
            return redirect()->route('user.planes')
                ->with('error', 'Pago procesado, pero hubo un error al activar el plan. Contacta soporte con el ID: ' . $paymentId);
        }
    }

    // ──────────────────────────────────────────────
    //  3. Pago rechazado o cancelado
    // ──────────────────────────────────────────────
    public function changePlanFailure()
    {
        session()->forget('mp_plan_change');

        return redirect()->route('user.planes')
            ->with('error', 'El pago no pudo completarse. Puedes intentarlo nuevamente.');
    }

    // ──────────────────────────────────────────────
    //  4. Pago pendiente (transferencias, etc.)
    // ──────────────────────────────────────────────
    public function changePlanPending()
    {
        return redirect()->route('user.planes')
            ->with('info', 'Tu pago está pendiente. Cuando se confirme, tu plan se actualizará automáticamente.');
    }
}
