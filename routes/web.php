<?php

use App\Http\Controllers\BookController;
use App\Http\Controllers\ProductController;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\CatalogController;
use App\Http\Controllers\SubscriptionPlanController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CategoryController;
use Illuminate\Support\Facades\Log;


Route::get('/dashboard', function () {
    $user = request()->user()->loadMissing('rol');

    return match ($user->rol->name) {
        'admin' => redirect()->route('admin.dashboard'),
        'user' => redirect()->route('user.dashboard'),
        default => abort(403),
    };
})->middleware(['auth', 'verified'])->name('dashboard');

// Rutas para el administrador
Route::middleware(['auth', 'verified', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminController::class , 'index'])->name('dashboard');

    // Rutas para los libros    
    Route::get('/books', [BookController::class , 'index'])->name('books.index');
    Route::post('/books', [BookController::class , 'store'])->name('books.store');
    Route::get('/books/{book}', [BookController::class , 'show'])->name('books.show');
    Route::post('/books/{book}', [BookController::class , 'update'])->name('books.update');
    Route::delete('/books/{book}', [BookController::class , 'destroy'])->name('books.destroy');
    Route::get('/books/{book}/preview', [BookController::class , 'preview'])->name('books.preview');
    // Rutas para los cursos        
    Route::get('/courses-admin', [CourseController::class , 'index'])->name('courses.index');
    Route::post('/courses-admin', [CourseController::class , 'store'])->name('courses.store');
    Route::get('/courses-admin/{course}', [CourseController::class , 'show'])->name('courses.show');
    Route::post('/courses-admin/{course}', [CourseController::class , 'update'])->name('courses.update');
    Route::delete('/courses-admin/{course}', [CourseController::class , 'destroy'])->name('courses.destroy');

    // Rutas para categorías
    Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
    Route::post('/categories', [CategoryController::class, 'store'])->name('categories.store');
    Route::post('/categories/{category}', [CategoryController::class, 'update'])->name('categories.update');
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');

});

// Rutas para el usuario estandar
Route::middleware(['auth', 'verified', 'role:user'])->prefix('user')->name('user.')->group(function () {
    Route::get('/dashboard', [UserController::class , 'index'])->name('dashboard');
    // Rutas para los libros que el usuario compro
    Route::get('/books', [UserController::class , 'books'])->name('books.index');
    // Rutas para los cursos que el usuario tendra acceso 
    Route::get('/courses', [UserController::class , 'courses'])->name('courses.index');
});

// Rutas publicas
Route::get('/courses/{id}', [CatalogController::class , 'show'])->name('catalog.courses.show');

Route::get('/books', [CatalogController::class , 'index'])
    ->name('products.books');

Route::get('/recursos', function (Request $request) {
    // 1. Obtenemos los filtros de la URL
    $search = $request->input('search');
    $type = $request->input('type', 'all');

    // 2. Construimos la consulta base
    $query = Product::with(['category', 'course.lessons'])->where('is_active', true);

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
    'filters' => [ // Los filtros actuales para React
    'search' => $search,
    'type' => $type
    ]
    ]);
});

Route::get('/payment/{slug}', function ($slug) {
    return Inertia::render('cardPayment', [
    'slug' => $slug
    ]);
})->name('cardPayment');

/* Rutas para suscripciones */
Route::get('/suscripciones', [SubscriptionPlanController::class , 'index'])->name('subscriptions.index');
Route::post('/suscripciones', [SubscriptionPlanController::class , 'store'])->name('subscriptions.store');
Route::get('/suscripciones/{plan:slug}', [SubscriptionPlanController::class , 'show'])->name('subscriptions.show');

Route::get('/libro/chips-y-el-largo-camino-a-primavera', function () {
    return Inertia::render('detalle');
});

Route::get('/', function (Request $request) {
    // 5. Retornamos la vista 'welcome' (la Landing Page) con todos los datos combinados
    return Inertia::render('welcome', [
    'canRegister' => Features::enabled(Features::registration())
    ]);
})->name('home');


Route::get('/products', [ProductController::class , 'index'])
    ->name('products.index');

require __DIR__ . '/settings.php';
