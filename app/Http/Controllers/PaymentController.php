<?php

namespace App\Http\Controllers;

use App\Models\Membership;
use App\Models\SubscriptionPlan;
use App\Models\User;
use App\Services\PayPalService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class PaymentController extends Controller
{
    /**
     * Muestra la página de checkout para un plan específico.
     * Ruta: GET /payment/{slug}
     */
    public function show(string $slug)
    {
        // Buscamos el plan en la BD por su slug
        $plan = SubscriptionPlan::active()
            ->where('slug', $slug)
            ->firstOrFail();

        return Inertia::render('cardPayment', [
            'plan' => $plan,
        ]);
    }

    /**
     * Procesa el formulario: guarda datos en sesión y crea la Order en PayPal.
     * Ruta: POST /payment/{slug}/checkout
     */
    public function checkout(Request $request, string $slug, PayPalService $paypal)
    {
        // 1. Buscar el plan
        $plan = SubscriptionPlan::active()
            ->where('slug', $slug)
            ->firstOrFail();

        // 2. Validar datos del usuario
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|min:8|confirmed',
        ]);

        // 3. Guardar datos en sesión (NO creamos el usuario todavía,
        //    el pago puede fallar o el usuario puede cancelar)
        Session::put('pending_registration', [
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'plan_id'  => $plan->id,
            'plan_slug' => $plan->slug,
        ]);

        try {
            // 4. Crear la Order en PayPal
            $order = $paypal->createOrder(
                (float) $plan->effective_price,
                "Suscripción {$plan->name} - AulaFutura",
                $plan->slug
            );

            // 5. Guardar el Order ID en sesión para verificarlo al regresar
            Session::put('paypal_order_id', $order['id']);

            // 6. Obtener la URL de aprobación que devuelve PayPal
            //    PayPal devuelve varios links, necesitamos el de rel="approve"
            $approvalUrl = collect($order['links'])
                ->firstWhere('rel', 'approve')['href'] ?? null;

            if (!$approvalUrl) {
                throw new \Exception('PayPal no devolvió URL de aprobación');
            }

            // 7. Redirigir al usuario a PayPal
            //    Inertia::location hace un redirect HTTP completo (no SPA)
            return Inertia::location($approvalUrl);
        } catch (\Exception $e) {
            Log::error('PayPal checkout error: ' . $e->getMessage());
            Session::forget(['pending_registration', 'paypal_order_id']);

            return back()->withErrors([
                'paypal' => 'Error al conectar con PayPal. Por favor intenta de nuevo.',
            ]);
        }
    }

    /**
     * PayPal redirige aquí cuando el usuario APRUEBA el pago.
     * URL: /paypal/success?token=ORDER_ID&PayerID=XXXXX
     * Ruta: GET /paypal/success
     */
    public function success(Request $request, PayPalService $paypal)
    {
        // El token que envía PayPal en la URL ES el Order ID
        $orderId = $request->query('token');

        // Verificar que el Order ID coincide con el que guardamos en sesión
        // (medida de seguridad para evitar manipulación de URL)
        if (!$orderId || $orderId !== Session::get('paypal_order_id')) {
            return redirect()->route('subscriptions.index')
                ->with('error', 'Token de pago inválido o expirado.');
        }

        $pendingData = Session::get('pending_registration');

        if (!$pendingData) {
            return redirect()->route('subscriptions.index')
                ->with('error', 'No se encontraron datos de registro. Por favor intenta de nuevo.');
        }

        try {
            // 1. Capturar el pago en PayPal (confirmar el cobro)
            $capture = $paypal->captureOrder($orderId);

            // 2. Verificar que PayPal confirma el pago como COMPLETED
            if (($capture['status'] ?? '') !== 'COMPLETED') {
                throw new \Exception('El pago no fue completado. Estado: ' . ($capture['status'] ?? 'desconocido'));
            }

            // 3. Obtener el plan de la BD
            $plan = SubscriptionPlan::findOrFail($pendingData['plan_id']);

            // 4. Crear usuario + membresía en una transacción atómica
            //    Si algo falla en el medio, se revierte todo (no queda usuario sin membresía)
            $user = DB::transaction(function () use ($pendingData, $plan) {

                // Crear el usuario con rol de usuario estándar
                // Ajusta el role_id según el ID que tengas en tu tabla de roles
                $user = User::create([
                    'name'      => $pendingData['name'],
                    'email'     => $pendingData['email'],
                    'password'  => $pendingData['password'], // ya viene hasheado
                    'role_id'   => 2, // <-- ajusta según tu tabla de roles (2 = user)
                    'is_active' => true,
                ]);

                // Crear la membresía activa
                Membership::create([
                    'user_id'    => $user->id,
                    'plan_id'    => $plan->id,
                    'status'     => 'active',
                    'start_date' => now(),
                    'end_date'   => now()->addDays($plan->duration_days),
                ]);

                return $user;
            });

            // 5. Limpiar la sesión
            Session::forget(['pending_registration', 'paypal_order_id']);

            // 6. Iniciar sesión automáticamente
            Auth::login($user);

            // 7. Redirigir al dashboard con mensaje de éxito
            return redirect()->route('dashboard')
                ->with('success', '¡Bienvenido a AulaFutura! Tu suscripción está activa.');
        } catch (\Exception $e) {
            Log::error('PayPal success/capture error: ' . $e->getMessage());
            Session::forget(['pending_registration', 'paypal_order_id']);

            return redirect()->route('subscriptions.index')
                ->with('error', 'Hubo un problema al procesar tu pago: ' . $e->getMessage());
        }
    }

    /**
     * PayPal redirige aquí cuando el usuario CANCELA en la página de PayPal.
     * Ruta: GET /paypal/cancel
     */
    public function cancel()
    {
        Session::forget(['pending_registration', 'paypal_order_id']);

        return redirect()->route('subscriptions.index')
            ->with('info', 'Pago cancelado. Puedes intentarlo cuando quieras.');
    }
}
