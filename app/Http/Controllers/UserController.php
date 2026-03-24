<?php

namespace App\Http\Controllers;

use App\Http\Resources\SubscriptionPlanResource;
use App\Models\SubscriptionPlan;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

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

    public function bookPreview(Product $book)
    {
        $user = request()->user();

        // Verificar que el usuario tiene membresía activa con este libro
        $membership = $user->memberships()
            ->where('status', 'active')
            ->where('end_date', '>=', now())
            ->with('plan.products')
            ->latest()
            ->first();

        // Si no tiene membresía o el libro no está en su plan → 403
        if (!$membership) {
            abort(403, 'No tienes acceso a este libro.');
        }

        $hasAccess = $membership->plan->products
            ->where('id', $book->id)
            ->isNotEmpty();

        if (!$hasAccess) {
            abort(403, 'Este libro no está incluido en tu plan.');
        }

        $book->load('bookFile');

        if (!$book->bookFile) {
            abort(404, 'El libro no tiene archivo.');
        }

        $path = $book->bookFile->file_path;

        if (!Storage::disk('private')->exists($path)) {
            abort(404, 'Archivo no encontrado.');
        }

        return response()->file(Storage::disk('private')->path($path), [
            'Content-Type'        => 'application/pdf',
            'Content-Disposition' => 'inline; filename="' . $book->title . '.pdf"',
        ]);
    }
}
