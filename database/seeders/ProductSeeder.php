<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Obtenemos las categorías creadas previamente
        $frontendCat = Category::where('name', 'Desarrollo Frontend')->first();
        $sistemasCat = Category::where('name', 'Ingeniería de Sistemas')->first();
        $qaCat = Category::where('name', 'QA y Automatización')->first();

        // 1. Crear un Libro de Frontend
        $book1 = Product::create([
            'category_id' => $frontendCat->id,
            'title' => 'Dominando Astro y React para Portafolios',
            'description' => 'Aprende a construir sitios estáticos ultrarrápidos y componentes interactivos modernos.',
            'price' => 25.50,
            'type' => 'book',
            'thumbnail' => null, // Puedes poner la ruta de una imagen falsa si tienes
            'is_active' => true,
        ]);

        // Relación: Crear el archivo para el libro
        $book1->bookFile()->create([
            'file_path' => 'books/dummy_astro_react.pdf',
        ]);

        // 2. Crear un Libro de Sistemas (Ej: Proyectos médicos o académicos)
        $book2 = Product::create([
            'category_id' => $sistemasCat->id,
            'title' => 'Arquitectura de Sistemas para Entornos de Salud',
            'description' => 'Guía completa sobre el desarrollo y despliegue de sistemas robustos.',
            'price' => 30.00,
            'type' => 'book',
            'thumbnail' => null,
            'is_active' => true,
        ]);

        $book2->bookFile()->create([
            'file_path' => 'books/dummy_arquitectura_sistemas.pdf',
        ]);

        // 3. Crear un Curso de QA (No lleva book_file)
        Product::create([
            'category_id' => $qaCat->id,
            'title' => 'Testing E2E con Playwright y Selenium',
            'description' => 'De cero a experto en automatización de pruebas para aplicaciones web modernas.',
            'price' => 89.99,
            'type' => 'course',
            'thumbnail' => null,
            'is_active' => true,
        ]);
    }
}
