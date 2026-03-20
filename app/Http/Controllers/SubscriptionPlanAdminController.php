<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\SubscriptionPlan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str as SupportStr;
use Inertia\Inertia;
use Pest\Support\Str;

class SubscriptionPlanAdminController extends Controller
{
    // ──────────────────────────────────────────────
    //  Listado (Admin)
    // ──────────────────────────────────────────────
    public function index()
    {
        $plans = SubscriptionPlan::withCount(['products', 'memberships'])
            ->latest()
            ->get();

        // Todos los productos activos para el selector del modal
        $products = Product::where('is_active', true)
            ->select('id', 'title', 'type', 'thumbnail', 'price')
            ->orderBy('type')
            ->orderBy('title')
            ->get();

        return Inertia::render('SubscriptionPlans/Index', [
            'plans'    => $plans,
            'products' => $products,
        ]);
    }

    // ──────────────────────────────────────────────
    //  Crear plan
    // ──────────────────────────────────────────────
    public function store(Request $request)
    {
        Log::info("CREANDO PLAN :");
        Log::info($request->all());
        $validated = $request->validate([
            'name'           => 'required|string|max:255',
            'billing_cycle'  => 'required|in:semanal,mensual,trimestral,semestral,anual',
            'price'          => 'required|numeric|min:0',
            'features'       => 'nullable|array',
            'features.*'     => 'string|max:255',
            'icon'           => 'required|in:star,rocket,crown',
            'is_active'      => 'boolean',
            'product_ids'    => 'nullable|array',
            'product_ids.*'  => 'exists:products,id',
        ]);

        $durationMap = [
            'semanal'    => 7,
            'mensual'    => 30,
            'trimestral' => 90,
            'semestral'  => 180,
            'anual'      => 365,
        ];

        $plan = SubscriptionPlan::create([
            'name'          => $validated['name'],
            'slug'          => SupportStr::slug($validated['name']),
            'billing_cycle' => $validated['billing_cycle'],
            'duration_days' => $durationMap[$validated['billing_cycle']],
            'price'         => $validated['price'],
            'currency'      => 'ARS',
            'icon'          => $validated['icon'],
            'features'      => $validated['features'] ?? [],
            'is_active'     => $request->boolean('is_active', true),
        ]);

        if (!empty($validated['product_ids'])) {
            $plan->products()->sync($validated['product_ids']);
        }

        return redirect()->back()->with('success', 'Plan creado correctamente.');
    }

    // ──────────────────────────────────────────────
    //  Ver plan (JSON para modal)
    // ──────────────────────────────────────────────
    public function show(SubscriptionPlan $plan)
    {
        $plan->load(['products:id,title,type,thumbnail,price']);
        $plan->loadCount(['memberships', 'products']);

        return response()->json($plan);
    }

    // ──────────────────────────────────────────────
    //  Actualizar plan
    // ──────────────────────────────────────────────
    public function update(Request $request, SubscriptionPlan $plan)
    {
        $validated = $request->validate([
            'name'           => 'required|string|max:255',
            'billing_cycle'  => 'required|in:semanal,mensual,trimestral,semestral,anual',
            'price'          => 'required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0',
            'currency'       => 'nullable|string|size:3',
            'features'       => 'nullable|array',
            'features.*'     => 'string|max:255',
            'is_active'      => 'boolean',
            'product_ids'    => 'nullable|array',
            'product_ids.*'  => 'exists:products,id',
        ]);

        $plan->update([
            'name'           => $validated['name'],
            'slug'           => SupportStr::slug($validated['name']),
            'billing_cycle'  => $validated['billing_cycle'],
            'price'          => $validated['price'],
            'discount_price' => $validated['discount_price'] ?? null,
            'currency'       => $validated['currency'] ?? 'USD',
            'features'       => $validated['features'] ?? [],
            'is_active'      => $request->boolean('is_active', true),
        ]);

        // sync reemplaza toda la lista (quita los que no vengan, agrega los nuevos)
        $plan->products()->sync($validated['product_ids'] ?? []);

        return redirect()->back()->with('success', 'Plan actualizado correctamente.');
    }

    // ──────────────────────────────────────────────
    //  Eliminar plan
    // ──────────────────────────────────────────────
    public function destroy(SubscriptionPlan $plan)
    {
        Log::info("ELIMINANDO PLAN :");
        Log::info($plan);
        // Evitar borrar si tiene membresías activas
        if ($plan->memberships()->where('status', 'active')->exists()) {
            return redirect()->back()->withErrors([
                'error' => 'No puedes eliminar un plan con membresías activas.'
            ]);
        }

        $plan->products()->detach();
        $plan->delete(); // SoftDelete

        return redirect()->back()->with('success', 'Plan eliminado correctamente.');
    }

    // ──────────────────────────────────────────────
    //  Vista pública de suscripciones (landing)
    // ──────────────────────────────────────────────
    public function publicIndex()
    {
        $plans = SubscriptionPlan::where('is_active', true)
            ->with('products:id,title,type')
            ->withCount('products')
            ->orderBy('price')
            ->get();

        return Inertia::render('subscriptions', [
            'plans' => $plans,
        ]);
    }
}
