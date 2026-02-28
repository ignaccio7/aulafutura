<?php

namespace App\Http\Controllers;

use App\Http\Resources\SubscriptionPlanResource;
use App\Models\SubscriptionPlan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubscriptionPlanController extends Controller
{
    public function index()
    {
        $plans = SubscriptionPlan::active()->get();

        return Inertia::render('subscriptions', [
            'plans' => SubscriptionPlanResource::collection($plans)
        ]);
    }

    public function show(SubscriptionPlan $plan)
    {
        return Inertia::render('subscriptions', [
            'plan' => new SubscriptionPlanResource($plan)
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'           => 'required|string|max:100',
            'slug'           => 'required|string|max:100|unique:subscription_plans',
            'billing_cycle'  => 'required|in:semanal,mensual,trimestral,semestral,anual',
            'duration_days'  => 'required|integer|min:1',
            'price'          => 'required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0',
            'currency'       => 'nullable|string|size:3',
            'features'       => 'nullable|array',
            'is_active'      => 'nullable|boolean',
        ]);

        SubscriptionPlan::create($validated);

        return redirect()->route('subscriptions.index');
    }
}
