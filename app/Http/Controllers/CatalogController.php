<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CatalogController extends Controller
{
    public function index(Request $request): Response
    {
        $categoryId = $request->query('category');

        $query = Product::query()
            ->where('type', 'course')
            ->where('is_active', true)
            ->with([
                'category',
                'course.lessons'
            ]);

        if ($categoryId) {
            $query->where('category_id', $categoryId);
        }

        $products = $query
            ->latest()
            ->paginate(9)
            ->withQueryString();

        $categories = Category::where('type', 'course')->get();

        return Inertia::render('catalog/courses', [
            'products'   => $products,
            'categories' => $categories,
            'filters'    => [
                'category' => $categoryId,
            ],
        ]);
    }

 public function show(int $id): Response
{
    $product = Product::where('type', 'course')
        ->where('is_active', true)
        ->with([
            'category:id,name',
            'course.lessons',
        ])
        ->findOrFail($id);

    return Inertia::render('catalog/CourseDetail', [
        'product' => $product,
    ]);
}

}