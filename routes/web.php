<?php

use App\Http\Controllers\ProductController;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function (Request $request) {
    // 1. Obtenemos los filtros de la URL
    $search = $request->input('search');
    $type = $request->input('type', 'all');

    // 2. Construimos la consulta base
    $query = Product::with('category')->where('is_active', true);

    // 3. Aplicamos filtros si existen
    if ($type !== 'all') {
        $query->where('type', $type);
    }
    if ($search) {
        $query->where('title', 'like', "%{$search}%");
    }

    // 4. Paginamos los resultados
    $products = $query->latest()->paginate(6)->withQueryString();

    // 5. Retornamos la vista 'welcome' (la Landing Page) con todos los datos combinados
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()), // Lo que tenías antes
        'products' => $products, // Los productos paginados
        'filters' => [           // Los filtros actuales para React
            'search' => $search,
            'type' => $type
        ]
    ]);
})->name('home');

Route::get('dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/products', [ProductController::class, 'index'])
    ->name('products.index');

require __DIR__ . '/settings.php';
