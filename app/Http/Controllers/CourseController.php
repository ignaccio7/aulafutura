<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Course;
use App\Models\Lesson;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class CourseController extends Controller
{
    public function index(): Response
    {
        $courses = Product::with(['course.lessons', 'category'])
            ->where('type', 'course')
            ->latest()
            ->get();

        $categories = Category::where('type', 'course')
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Courses/Index', [
            'courses' => $courses,
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:200',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'is_active' => 'boolean',
            'thumbnail' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'requirements' => 'nullable|string',
            'lessons' => 'nullable|array',
            'lessons.*.title' => 'required|string|max:200',
            'lessons.*.duration' => 'required|integer|min:1',
            'lessons.*.order_number' => 'required|integer|min:1',
            'lessons.*.video_url' => 'nullable|string|url',
        ]);

        $thumbnailPath = null;
        if ($request->hasFile('thumbnail')) {
            $thumbnailPath = $request->file('thumbnail')
                ->store('courses/thumbnails', 'public');
        }

        DB::transaction(function () use ($validated, $thumbnailPath, $request) {
            $product = Product::create([
                'title' => $validated['title'],
                'description' => $validated['description'] ?? null,
                'price' => $validated['price'],
                'category_id' => $validated['category_id'],
                'is_active' => $request->boolean('is_active', true),
                'type' => 'course',
                'thumbnail' => $thumbnailPath,
            ]);

            $lessons = $validated['lessons'] ?? [];
            $duration = array_sum(array_column($lessons, 'duration'));

            $course = Course::create([
                'product_id' => $product->id,
                'total_duration' => $duration,
                'description' => $validated['description'] ?? null,
                'requirements' => $validated['requirements'] ?? null,
            ]);

            foreach ($lessons as $lesson) {
                Lesson::create([
                    'course_id' => $course->id,
                    'title' => $lesson['title'],
                    'duration' => $lesson['duration'],
                    'order_number' => $lesson['order_number'],
                    'video_url' => $lesson['video_url'] ?? null,
                ]);
            }
        });

        return redirect()->back()->with('success', 'Curso creado correctamente.');
    }

    public function show(Product $course)
    {
        $course->load(['course.lessons', 'category']);
        return response()->json($course);
    }

    public function update(Request $request, Product $course)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:200',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'is_active' => 'boolean',
            'thumbnail' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'requirements' => 'nullable|string',
            'lessons' => 'nullable|array',
            'lessons.*.title' => 'required|string|max:200',
            'lessons.*.duration' => 'required|integer|min:1',
            'lessons.*.order_number' => 'required|integer|min:1',
            'lessons.*.video_url' => 'nullable|string|url',
        ]);

        DB::transaction(function () use ($validated, $request, $course) {
            if ($request->hasFile('thumbnail')) {
                if ($course->thumbnail) {
                    Storage::disk('public')->delete($course->thumbnail);
                }
                $validated['thumbnail'] = $request->file('thumbnail')
                    ->store('courses/thumbnails', 'public');
            }

            $course->update([
                'title' => $validated['title'],
                'description' => $validated['description'] ?? null,
                'price' => $validated['price'],
                'category_id' => $validated['category_id'],
                'is_active' => $request->boolean('is_active', true),
                'thumbnail' => $validated['thumbnail'] ?? $course->thumbnail,
            ]);

            $lessons = $validated['lessons'] ?? [];
            $duration = array_sum(array_column($lessons, 'duration'));

            $course->course()->update([
                'total_duration' => $duration,
                'description' => $validated['description'] ?? null,
                'requirements' => $validated['requirements'] ?? null,
            ]);

            $course->course->lessons()->delete();
            foreach ($lessons as $lesson) {
                Lesson::create([
                    'course_id' => $course->course->id,
                    'title' => $lesson['title'],
                    'duration' => $lesson['duration'],
                    'order_number' => $lesson['order_number'],
                    'video_url' => $lesson['video_url'] ?? null,
                ]);
            }
        });

        return redirect()->back()->with('success', 'Curso actualizado correctamente.');
    }

    public function destroy(Product $course)
    {
        if ($course->thumbnail) {
            Storage::disk('public')->delete($course->thumbnail);
        }
        $course->delete();

        return redirect()->back()->with('success', 'Curso eliminado correctamente.');
    }
}
