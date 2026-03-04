<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        return inertia('user/dashboard', [
            'membership' => [
                'plan' => 'Plan lector',
                'active' => true,
                'expires_at' => now()->addMonths(10)->format('d M, Y'),
                'price' => '$199.00',
            ],
            'stats' => [
                'total_books' => 5,
                'total_courses' => 3,
            ],
            'courseProgress' => [
                ['name' => 'Matemáticas', 'progress' => 75],
                ['name' => 'Ciencias', 'progress' => 40],
                ['name' => 'Literatura', 'progress' => 90],
                ['name' => 'Historia', 'progress' => 20],
            ],
            'recentCourses' => [
                ['id' => 1, 'title' => 'Matemáticas Divertidas', 'instructor' => 'Carmen G.', 'progress' => 75, 'image' => 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400'],
                ['id' => 2, 'title' => 'Ciencias Naturales', 'instructor' => 'Roberto S.', 'progress' => 40, 'image' => 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400'],
            ],
            'purchasedBooks' => [
                ['id' => 1, 'title' => 'Chips y Primavera', 'author' => 'A. Futura', 'image' => 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400'],
                ['id' => 2, 'title' => 'Aula Digital', 'author' => 'Eduardo T.', 'image' => 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400'],
            ]
        ]);
    }

    public function books()
    {
        return inertia('user/books');
    }

    public function courses()
    {
        return inertia('user/courses');
    }
}
