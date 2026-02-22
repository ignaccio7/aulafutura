<?php

use App\Http\Controllers\BookController;
use App\Http\Controllers\ProductController;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\CatalogController;

Route::get('/cursos', [CatalogController::class, 'index'])
    ->name('catalog.courses');

Route::get('/books', [CatalogController::class, 'index'])
    ->name('products.books');

Route::get('/recursos', function (Request $request) {
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
    return Inertia::render('resources', [
        'products' => $products, // Los productos paginados
        'filters' => [           // Los filtros actuales para React
            'search' => $search,
            'type' => $type
        ]
    ]);
});

Route::get('/suscripciones', function () {
    return Inertia::render('subscriptions');
});

Route::get('/libro/chips-y-el-largo-camino-a-primavera', function () {
    return Inertia::render('detalle');
});

Route::get('/', function (Request $request) {
    // 5. Retornamos la vista 'welcome' (la Landing Page) con todos los datos combinados
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration())
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::get('/books',             [BookController::class, 'index'])->name('books.index');
    Route::post('/books',            [BookController::class, 'store'])->name('books.store');
    Route::get('/books/{book}',      [BookController::class, 'show'])->name('books.show');
    Route::post('/books/{book}',     [BookController::class, 'update'])->name('books.update');
    Route::delete('/books/{book}',   [BookController::class, 'destroy'])->name('books.destroy');
    Route::get('/books/{book}/preview', [BookController::class, 'preview'])
        ->name('books.preview');
});

Route::get('/products', [ProductController::class, 'index'])
    ->name('products.index');

require __DIR__ . '/settings.php';
