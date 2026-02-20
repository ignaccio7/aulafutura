<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $frontendCat = Category::where('name', 'Desarrollo Frontend')->first();
        $sistemasCat = Category::where('name', 'Ingeniería de Sistemas')->first();
        $qaCat = Category::where('name', 'QA y Automatización')->first();

        /*
        |--------------------------------------------------------------------------
        | PRODUCTOS EXISTENTES MEJORADOS
        |--------------------------------------------------------------------------
        */

        $book1 = Product::create([
            'category_id' => $frontendCat->id,
            'title' => 'Dominando Astro y React para Portafolios',
            'description' => 'Aprende a construir sitios estáticos ultrarrápidos, optimizar SEO y crear componentes interactivos modernos con Astro y React.',
            'price' => 25.50,
            'type' => 'book',
            'thumbnail' => 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4',
            'is_active' => true,
        ]);

        $book1->bookFile()->create([
            'file_path' => 'books/dummy_astro_react.pdf',
        ]);

        $book2 = Product::create([
            'category_id' => $sistemasCat->id,
            'title' => 'Arquitectura de Sistemas para Entornos de Salud',
            'description' => 'Guía completa sobre diseño de arquitecturas escalables, microservicios y buenas prácticas en sistemas críticos.',
            'price' => 30.00,
            'type' => 'book',
            'thumbnail' => 'https://images.unsplash.com/photo-1581092919535-7146ff1b7c0b',
            'is_active' => true,
        ]);

        $book2->bookFile()->create([
            'file_path' => 'books/dummy_arquitectura_sistemas.pdf',
        ]);

        Product::create([
            'category_id' => $qaCat->id,
            'title' => 'Testing E2E con Playwright y Selenium',
            'description' => 'Curso completo para dominar pruebas automatizadas en aplicaciones modernas.',
            'price' => 89.99,
            'type' => 'course',
            'thumbnail' => 'https://images.unsplash.com/photo-1581091012184-5c7f9a6a5f90',
            'is_active' => true,
        ]);

        /*
        |--------------------------------------------------------------------------
        | 15 PRODUCTOS EDUCATIVOS DE COLEGIO
        |--------------------------------------------------------------------------
        */

        $schoolProducts = [
            [
                'title' => 'Matemática Básica para Secundaria',
                'description' => 'Álgebra, fracciones, ecuaciones y problemas prácticos paso a paso.',
                'price' => 18.00,
                'thumbnail' => 'https://images.unsplash.com/photo-1509228468518-180dd4864904',
            ],
            [
                'title' => 'Curso Completo de Física Escolar',
                'description' => 'Movimiento, leyes de Newton, energía y ejercicios resueltos.',
                'price' => 22.50,
                'thumbnail' => 'https://images.unsplash.com/photo-1532094349884-543bc11b234d',
            ],
            [
                'title' => 'Química General para Bachillerato',
                'description' => 'Tabla periódica, enlaces químicos y reacciones básicas.',
                'price' => 21.00,
                'thumbnail' => 'https://images.unsplash.com/photo-1581093588401-16ec7c2f3c3a',
            ],
            [
                'title' => 'Biología: El Cuerpo Humano',
                'description' => 'Sistemas del cuerpo humano y funciones principales.',
                'price' => 19.90,
                'thumbnail' => 'https://images.unsplash.com/photo-1530210124550-912dc1381cb8',
            ],
            [
                'title' => 'Historia Universal Ilustrada',
                'description' => 'Desde las civilizaciones antiguas hasta la era moderna.',
                'price' => 17.50,
                'thumbnail' => 'https://images.unsplash.com/photo-1461360370896-922624d12aa1',
            ],
            [
                'title' => 'Geografía del Mundo',
                'description' => 'Continentes, países, mapas políticos y físicos.',
                'price' => 16.80,
                'thumbnail' => 'https://images.unsplash.com/photo-1524661135-423995f22d0b',
            ],
            [
                'title' => 'Lenguaje y Literatura',
                'description' => 'Análisis literario, gramática y redacción.',
                'price' => 20.00,
                'thumbnail' => 'https://images.unsplash.com/photo-1519681393784-d120267933ba',
            ],
            [
                'title' => 'Inglés Básico para Estudiantes',
                'description' => 'Gramática esencial, vocabulario y ejercicios prácticos.',
                'price' => 15.00,
                'thumbnail' => 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f',
            ],
            [
                'title' => 'Educación Financiera Escolar',
                'description' => 'Ahorro, presupuesto y conceptos básicos de economía.',
                'price' => 14.90,
                'thumbnail' => 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c',
            ],
            [
                'title' => 'Programación Básica para Jóvenes',
                'description' => 'Introducción a la lógica y fundamentos de programación.',
                'price' => 24.99,
                'thumbnail' => 'https://images.unsplash.com/photo-1518770660439-4636190af475',
            ],
            [
                'title' => 'Arte y Dibujo Creativo',
                'description' => 'Técnicas básicas de dibujo y creatividad artística.',
                'price' => 13.50,
                'thumbnail' => 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
            ],
            [
                'title' => 'Educación Cívica y Ciudadanía',
                'description' => 'Valores, derechos y deberes ciudadanos.',
                'price' => 12.00,
                'thumbnail' => 'https://images.unsplash.com/photo-1529070538774-1843cb3265df',
            ],
            [
                'title' => 'Taller de Redacción Escolar',
                'description' => 'Cómo escribir ensayos, informes y textos académicos.',
                'price' => 14.75,
                'thumbnail' => 'https://images.unsplash.com/photo-1455390582262-044cdead277a',
            ],
            [
                'title' => 'Curso de Robótica Escolar',
                'description' => 'Introducción a sensores, motores y programación básica.',
                'price' => 39.99,
                'thumbnail' => 'https://images.unsplash.com/photo-1581090700227-4c4f50b3e3f5',
            ],
            [
                'title' => 'Preparación para Exámenes Finales',
                'description' => 'Guía práctica con resúmenes y simulacros de examen.',
                'price' => 27.00,
                'thumbnail' => 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b',
            ],
        ];

        foreach ($schoolProducts as $item) {
            $book = Product::create([
                'category_id' => $sistemasCat->id,
                'title' => $item['title'],
                'description' => $item['description'],
                'price' => $item['price'],
                'type' => 'book',
                'thumbnail' => $item['thumbnail'],
                'is_active' => true,
            ]);

            $book->bookFile()->create([
                'file_path' => 'books/dummy_school_content.pdf',
            ]);
        }
    }
}