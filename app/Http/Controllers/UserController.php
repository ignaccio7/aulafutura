<?php

namespace App\Http\Controllers;

use App\Http\Resources\SubscriptionPlanResource;
use App\Models\SubscriptionPlan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    public function index()
    {
        $user = request()->user();
        Log::info("El usuario es");
        Log::info($user);

        // Membresía activa con su plan y los productos incluidos
        $membership = $user->memberships()
            ->where('status', 'active')
            ->where('end_date', '>=', now())
            ->with(['plan.products' => function ($q) {
                $q->select('products.id', 'products.title', 'products.type', 'products.thumbnail', 'products.description');
            }])
            ->latest()
            ->first();

        Log::info("Membresia del usuario");
        Log::info($membership);

        // Si no tiene membresía activa
        if (!$membership) {
            return inertia('user/dashboard', [
                'membership'  => null,
                'stats'       => ['total_books' => 0, 'total_courses' => 0],
                'books'       => [],
                'courses'     => [],
            ]);
        }

        // Separar productos del plan por tipo
        $products = $membership->plan->products ?? collect();
        $books    = $products->where('type', 'book')->values();
        $courses  = $products->where('type', 'course')->values();

        return inertia('user/dashboard', [
            'membership' => [
                'plan'       => $membership->plan->name,
                'icon'       => $membership->plan->icon ?? 'star',
                'active'     => $membership->status === 'active',
                'start_date' => $membership->start_date->format('d M, Y'),
                'expires_at' => $membership->end_date->format('d M, Y'),
                'price'      => $membership->plan->currency . ' ' . number_format($membership->plan->price, 2),
            ],
            'stats' => [
                'total_books'   => $books->count(),
                'total_courses' => $courses->count(),
            ],
            'books'   => $books,
            'courses' => $courses,
        ]);
    }


    public function books()
    {
        $user = request()->user();

        $membership = $user->memberships()
            ->where('status', 'active')
            ->where('end_date', '>=', now())
            ->with(['plan.products' => function ($q) {
                $q->where('products.type', 'book')
                    ->select('products.id', 'products.title', 'products.thumbnail', 'products.description');
            }])
            ->latest()
            ->first();

        $books = $membership?->plan->products ?? collect();

        return inertia('user/books', [
            'books' => $books->values(),
        ]);
    }

    public function courses()
    {
        $user = request()->user();

        $membership = $user->memberships()
            ->where('status', 'active')
            ->where('end_date', '>=', now())
            ->with(['plan.products' => function ($q) {
                $q->where('products.type', 'course')
                    ->select('products.id', 'products.title', 'products.thumbnail', 'products.description');
            }])
            ->latest()
            ->first();

        $courses = $membership?->plan->products ?? collect();

        return inertia('user/courses', [
            'courses' => $courses->values(),
        ]);
    }

    public function planes()
    {
        $user = request()->user();
        $plans = SubscriptionPlan::active()
            ->with(['products' => fn($q) => $q->select('products.id', 'products.title', 'products.type')])
            ->orderBy('price')
            ->get();

        $currentPlanId = $user
            ->memberships()
            ->where('status', 'active')
            ->where('end_date', '>=', now())
            ->latest()
            ->value('plan_id');

        return inertia('user/plans', [
            'plans'         => SubscriptionPlanResource::collection($plans),
            'currentPlanId' => $currentPlanId,
        ]);
    }
}
