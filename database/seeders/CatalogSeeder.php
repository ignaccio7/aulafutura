<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Course;
use App\Models\Lesson;
use App\Models\Product;
use Illuminate\Database\Seeder;

class CatalogSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            [
                'category' => 'Programación',
                'courses' => [
                    ['title' => 'Laravel desde cero',         'lessons' => ['Introducción', 'Instalación', 'Rutas', 'Controladores']],
                    ['title' => 'PHP moderno',                'lessons' => ['Variables', 'Funciones', 'OOP', 'Namespaces']],
                    ['title' => 'APIs REST con Laravel',      'lessons' => ['Qué es una API', 'Recursos', 'Autenticación']],
                ],
            ],
            [
                'category' => 'Diseño UI/UX',
                'courses' => [
                    ['title' => 'Figma para principiantes',   'lessons' => ['Interfaz', 'Componentes', 'Prototipos']],
                    ['title' => 'Tailwind CSS práctico',      'lessons' => ['Utilidades', 'Responsive', 'Dark mode', 'Animaciones']],
                ],
            ],
            [
                'category' => 'Matemáticas',
                'courses' => [
                    ['title' => 'Álgebra básica',             'lessons' => ['Ecuaciones', 'Factorización', 'Polinomios']],
                    ['title' => 'Geometría divertida',        'lessons' => ['Figuras', 'Áreas', 'Perímetros', 'Volúmenes']],
                    ['title' => 'Lógica matemática',          'lessons' => ['Proposiciones', 'Conjuntos', 'Funciones']],
                ],
            ],
            [
                'category' => 'Ciencias',
                'courses' => [
                    ['title' => 'El sistema solar',           'lessons' => ['Planetas', 'El Sol', 'La Luna', 'Asteroides']],
                    ['title' => 'Biología celular',           'lessons' => ['La célula', 'ADN', 'Mitosis']],
                ],
            ],
        ];

        foreach ($data as $block) {
            $category = Category::create([
                'name' => $block['category'],
                'type' => 'course',
            ]);

            foreach ($block['courses'] as $order => $courseData) {
                $product = Product::create([
                    'category_id' => $category->id,
                    'title'       => $courseData['title'],
                    'description' => "Descripción del curso: {$courseData['title']}",
                    'price'       => [0, 19.99, 29.99, 39.99][array_rand([0, 19.99, 29.99, 39.99])],
                    'type'        => 'course',
                    'is_active'   => true,
                ]);

                $course = Course::create([
                    'product_id'     => $product->id,
                    'total_duration' => 0,
                ]);

                $totalDuration = 0;
                foreach ($courseData['lessons'] as $i => $lessonTitle) {
                    $duration = rand(10, 45);
                    Lesson::create([
                        'course_id'    => $course->id,
                        'title'        => $lessonTitle,
                        'duration'     => $duration,
                        'order_number' => $i + 1,
                    ]);
                    $totalDuration += $duration;
                }

                $course->update(['total_duration' => $totalDuration]);
            }
        }
    }
}
