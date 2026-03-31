<?php

namespace App\Http\Controllers;

use App\Models\BookFile;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\StreamedResponse;

class BookController extends Controller
{
    //
    public function index()
    {
        $books      = Product::with(['bookFile', 'category'])->where('type', 'book')->latest()->get();
        $categories = Category::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Books/Index', [
            'books'      => $books,
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'price'       => 'required|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'is_active'   => 'boolean',
            'thumbnail'   => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'book_file'   => 'nullable|file|mimes:pdf|max:51200',
        ]);

        $thumbnailPath = null;
        if ($request->hasFile('thumbnail')) {
            $thumbnailPath = $request->file('thumbnail')->store('books/thumbnails', 'public');
        }

        $product = Product::create([
            'title'       => $validated['title'],
            'description' => $validated['description'] ?? null,
            'price'       => $validated['price'],
            'category_id' => $validated['category_id'],
            'is_active'   => $request->boolean('is_active', true),
            'type'        => 'book',
            'thumbnail'   => $thumbnailPath,
        ]);

        if ($request->hasFile('book_file')) {
            $filePath = $request->file('book_file')->store('books/files', 'private');
            BookFile::create([
                'product_id' => $product->id,
                'file_path'  => $filePath,
            ]);
        }

        return redirect()->back()->with('success', 'Libro creado correctamente.');
    }

    public function show(Product $book)
    {
        // Aseguramos que solo se muestren libros
        abort_if($book->type !== 'book', 404);

        $book->load(['bookFile', 'category']);

        return Inertia::render('catalog/BookDetail', [
            'book' => $book
        ]);
    }

    public function update(Request $request, Product $book)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'price'       => 'required|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'is_active'   => 'boolean',
            'thumbnail'   => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'book_file'   => 'nullable|file|mimes:pdf|max:51200',
        ]);

        // Reemplazar thumbnail si viene uno nuevo
        if ($request->hasFile('thumbnail')) {
            if ($book->thumbnail) {
                Storage::disk('public')->delete($book->thumbnail);
            }
            $validated['thumbnail'] = $request->file('thumbnail')->store('books/thumbnails', 'public');
        } else {
            // Mantener el existente
            unset($validated['thumbnail']);
        }

        $book->update([
            'title'       => $validated['title'],
            'description' => $validated['description'] ?? null,
            'price'       => $validated['price'],
            'category_id' => $validated['category_id'],
            'is_active'   => $request->boolean('is_active', true),
            'thumbnail'   => $validated['thumbnail'] ?? $book->thumbnail,
        ]);

        // Reemplazar PDF si viene uno nuevo
        if ($request->hasFile('book_file')) {
            if ($book->bookFile) {
                Storage::disk('private')->delete($book->bookFile->file_path);
                $book->bookFile->delete();
            }
            $filePath = $request->file('book_file')->store('books/files', 'private');
            BookFile::create([
                'product_id' => $book->id,
                'file_path'  => $filePath,
            ]);
        }

        return redirect()->back()->with('success', 'Libro actualizado correctamente.');
    }

    public function destroy(Product $book)
    {
        if ($book->thumbnail) {
            Storage::disk('public')->delete($book->thumbnail);
        }
        if ($book->bookFile) {
            Storage::disk('private')->delete($book->bookFile->file_path);
            $book->bookFile->delete();
        }
        $book->delete();

        return redirect()->back()->with('success', 'Libro eliminado correctamente.');
    }

    public function preview(Product $book)
    {
        $book->load('bookFile');

        if (!$book->bookFile) {
            abort(404, 'El libro no tiene archivo.');
        }

        $path = $book->bookFile->file_path;

        if (!Storage::disk('private')->exists($path)) {
            abort(404, 'Archivo no encontrado.');
        }

        $file = Storage::disk('private')->path($path);

        return response()->file($file, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="' . $book->title . '.pdf"',
        ]);
    }
}
