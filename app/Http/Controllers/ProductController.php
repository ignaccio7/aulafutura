<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProductController extends Controller
{
    //
    public function index(Request $request)
    {
        // 1. Recibimos los filtros desde la URL (Inertia los enviará automáticamente)
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

        // 4. Paginamos (ej. 6 por página) y preservamos los query params
        $products = $query->latest()->paginate(6)->withQueryString();

        // 5. Retornamos la vista de Inertia con los datos y los filtros actuales
        return Inertia::render('Products/libros', [ // O tu vista 'Welcome'
            'products' => $products,
            'filters' => [
                'search' => $search,
                'type' => $type,
            ]
        ]);
    }

    public function index2()
    {
        // Filtramos solo los de tipo 'book' y que estén activos
        $products = Product::with('category')
            ->where('type', 'book')
            ->where('is_active', true)
            ->latest()
            ->get();

        return Inertia::render('Products/libros', [
            'products' => $products
        ]);
    }

    public function create()
    {
        $categories = Category::all();
        return Inertia::render('Products/Create', [
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'title' => 'required|string|max:200',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'type' => 'required|in:book,course',
            'thumbnail' => 'nullable|image|max:2048', // 2MB max
            'is_active' => 'boolean',
            'book_file' => 'required_if:type,book|file|mimes:pdf|max:10240', // Obligatorio si es libro (10MB)
        ]);

        DB::transaction(function () use ($request) {
            $data = $request->except(['thumbnail', 'book_file']);
            $data['is_active'] = $request->boolean('is_active');

            // Subir thumbnail si existe
            if ($request->hasFile('thumbnail')) {
                $data['thumbnail'] = $request->file('thumbnail')->store('thumbnails', 'public');
            }

            $product = Product::create($data);

            // Subir el archivo del libro si el tipo es 'book'
            if ($product->type === 'book' && $request->hasFile('book_file')) {
                $filePath = $request->file('book_file')->store('books', 'local'); // Mejor 'local' si no quieres que sea público
                $product->bookFile()->create([
                    'file_path' => $filePath
                ]);
            }
        });

        return redirect()->route('products.index')->with('success', 'Producto creado exitosamente.');
    }

    public function edit(Product $product)
    {
        $product->load('bookFile'); // Cargamos la relación
        $categories = Category::all();

        return Inertia::render('Products/Edit', [
            'product' => $product,
            'categories' => $categories
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'title' => 'required|string|max:200',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'type' => 'required|in:book,course',
            'thumbnail' => 'nullable|image|max:2048',
            'is_active' => 'boolean',
            'book_file' => 'nullable|file|mimes:pdf|max:10240',
        ]);

        DB::transaction(function () use ($request, $product) {
            $data = $request->except(['thumbnail', 'book_file']);
            $data['is_active'] = $request->boolean('is_active');

            // Actualizar thumbnail
            if ($request->hasFile('thumbnail')) {
                if ($product->thumbnail) {
                    Storage::disk('public')->delete($product->thumbnail);
                }
                $data['thumbnail'] = $request->file('thumbnail')->store('thumbnails', 'public');
            }

            $product->update($data);

            // Si cambiamos de book a course, borramos el archivo si existe
            if ($product->type === 'course' && $product->bookFile) {
                Storage::disk('local')->delete($product->bookFile->file_path);
                $product->bookFile()->delete();
            }

            // Actualizar o crear BookFile si es tipo libro y se subió uno nuevo
            if ($product->type === 'book' && $request->hasFile('book_file')) {
                if ($product->bookFile) {
                    Storage::disk('local')->delete($product->bookFile->file_path);
                    $product->bookFile->update([
                        'file_path' => $request->file('book_file')->store('books', 'local')
                    ]);
                } else {
                    $product->bookFile()->create([
                        'file_path' => $request->file('book_file')->store('books', 'local')
                    ]);
                }
            }
        });

        return redirect()->route('products.index')->with('success', 'Producto actualizado exitosamente.');
    }

    public function destroy(Product $product)
    {
        DB::transaction(function () use ($product) {
            // Borrar thumbnail
            if ($product->thumbnail) {
                Storage::disk('public')->delete($product->thumbnail);
            }
            // Borrar book file
            if ($product->bookFile) {
                Storage::disk('local')->delete($product->bookFile->file_path);
            }

            $product->delete();
        });

        return redirect()->route('products.index');
    }
}
