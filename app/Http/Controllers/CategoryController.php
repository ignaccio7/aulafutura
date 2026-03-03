<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(): Response
    {
        $categories = Category::orderBy('name')->get();

        return Inertia::render('Categories/Index', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:categories,name',
            'type' => 'required|in:course,book',
        ]);

        Category::create($validated);

        return redirect()->back()->with('success', 'Categoría creada correctamente.');
    }

    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:categories,name,' . $category->id,
            'type' => 'required|in:course,book',
        ]);

        $category->update($validated);

        return redirect()->back()->with('success', 'Categoría actualizada correctamente.');
    }

    public function destroy(Category $category)
{
    if ($category->products()->count() > 0) {
        return redirect()->back()->withErrors(['error' => 'No se puede eliminar una categoría que tiene productos asociados.']);
    }

    $category->delete();

    return redirect()->back()->with('success', 'Categoría eliminada correctamente.');
}
}
