<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // Obtenemos las nuevas categorías
        $literaturaCat = Category::where('name', 'Literatura Clásica')->first();
        $escolarCat = Category::where('name', 'Educación Escolar')->first();
        $videoCat = Category::where('name', 'Cursos en Video')->first();

        /*
        |--------------------------------------------------------------------------
        | 11 LIBROS (Literatura y Escolares)
        |--------------------------------------------------------------------------
        */

        $books = [
            // Literatura
            [
                'category_id' => $literaturaCat->id,
                'title' => 'Don Quijote de la Mancha',
                'description' => 'La novela cumbre de la literatura española, escrita por Miguel de Cervantes.',
                'price' => 25.00,
                'thumbnail' => 'https://picsum.photos/seed/quijote/400/600',
            ],
            [
                'category_id' => $literaturaCat->id,
                'title' => 'Cuentos de los Hermanos Grimm',
                'description' => 'Colección de cuentos de hadas clásicos que han pasado de generación en generación.',
                'price' => 18.20,
                'thumbnail' => 'https://picsum.photos/seed/grimm/400/600',
            ],
            [
                'category_id' => $literaturaCat->id,
                'title' => 'Cien Años de Soledad',
                'description' => 'Obra maestra de Gabriel García Márquez y referente del realismo mágico.',
                'price' => 22.90,
                'thumbnail' => 'https://picsum.photos/seed/macondo/400/600',
            ],
            // Escolares
            [
                'category_id' => $escolarCat->id,
                'title' => 'Matemática Básica para Secundaria',
                'description' => 'Aritmética, geometría básica y problemas prácticos paso a paso.',
                'price' => 18.00,
                'thumbnail' => 'https://picsum.photos/seed/mate/400/600',
            ],
            [
                'category_id' => $escolarCat->id,
                'title' => 'Historia Universal Ilustrada',
                'description' => 'Desde las civilizaciones antiguas hasta la era moderna.',
                'price' => 17.50,
                'thumbnail' => 'https://picsum.photos/seed/historia/400/600',
            ],
            [
                'category_id' => $escolarCat->id,
                'title' => 'Geografía del Mundo',
                'description' => 'Continentes, países, mapas políticos y físicos.',
                'price' => 16.80,
                'thumbnail' => 'https://picsum.photos/seed/geografia/400/600',
            ],
            [
                'category_id' => $escolarCat->id,
                'title' => 'Lenguaje y Literatura',
                'description' => 'Análisis literario, gramática y redacción para colegio.',
                'price' => 20.00,
                'thumbnail' => 'https://picsum.photos/seed/lenguaje/400/600',
            ],
            [
                'category_id' => $escolarCat->id,
                'title' => 'Biología: El Cuerpo Humano',
                'description' => 'Sistemas del cuerpo humano, células y funciones principales.',
                'price' => 19.90,
                'thumbnail' => 'https://picsum.photos/seed/biologia/400/600',
            ],
            [
                'category_id' => $escolarCat->id,
                'title' => 'Química General para Bachillerato',
                'description' => 'Tabla periódica, enlaces químicos y reacciones básicas.',
                'price' => 21.00,
                'thumbnail' => 'https://picsum.photos/seed/quimica/400/600',
            ],
            [
                'category_id' => $escolarCat->id,
                'title' => 'Física Escolar Práctica',
                'description' => 'Movimiento, leyes de Newton, energía y ejercicios resueltos.',
                'price' => 22.50,
                'thumbnail' => 'https://picsum.photos/seed/fisica/400/600',
            ],
        ];

        foreach ($books as $item) {
            $book = Product::create([
                'category_id' => $item['category_id'],
                'title' => $item['title'],
                'description' => $item['description'],
                'price' => $item['price'],
                'type' => 'book',
                'thumbnail' => $item['thumbnail'],
                'is_active' => true,
            ]);

            // Se asocia el archivo del libro
            $book->bookFile()->create([
                'file_path' => 'books/dummy_book_content.pdf',
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | 3 VIDEOS / CURSOS
        |--------------------------------------------------------------------------
        */

        $videos = [
            [
                'title' => 'Curso Completo de Álgebra',
                'description' => 'Aprende álgebra desde cero. Ecuaciones, inecuaciones, funciones y gráficas explicadas paso a paso en video.',
                'price' => 35.00,
                'thumbnail' => 'https://picsum.photos/seed/algebra/400/600',
            ],
            [
                'title' => 'Dominando la Factorización',
                'description' => 'Curso especializado en todos los casos de factorización con ejemplos prácticos y ejercicios resueltos en pizarra.',
                'price' => 28.50,
                'thumbnail' => 'https://picsum.photos/seed/factorizacion/400/600',
            ],
            [
                'title' => 'Taller Práctico de Robótica Escolar',
                'description' => 'Aprende a ensamblar tus primeros circuitos, usar sensores y dar movimiento a mecanismos básicos.',
                'price' => 45.99,
                'thumbnail' => 'https://picsum.photos/seed/robotica/400/600',
            ],
        ];

        foreach ($videos as $item) {
            $video = Product::create([
                'category_id' => $videoCat->id,
                'title' => $item['title'],
                'description' => $item['description'],
                'price' => $item['price'],
                'type' => 'course', // Tipo curso/video
                'thumbnail' => $item['thumbnail'],
                'is_active' => true,
            ]);

            // Archivo de material de apoyo para el video (opcional)
            $video->bookFile()->create([
                'file_path' => 'courses/dummy_video_material.pdf',
            ]);
        }
    }
}
