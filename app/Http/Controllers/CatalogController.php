<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CatalogController extends Controller
{
    public function index(Request $request)
    {
        $categoryId = $request->query('category');

        $query = Product::query()
            ->where('type', 'course')
            ->where('is_active', true)
            ->with([
                'category',
                'course.lessons'
            ]);

        // Filtro por categoría (solo categorías de cursos)
        if ($categoryId) {
            $query->where('category_id', $categoryId);
        }

        $products = $query
            ->latest()
            ->paginate(9)
            ->withQueryString();

        // Traer solo categorías de tipo course
        $categories = Category::where('type', 'course')->get();

        return Inertia::render('catalog/courses', [
            'products' => $products,
            'categories' => $categories,
            'filters' => [
                'category' => $categoryId,
            ],
        ]);
    }
}
