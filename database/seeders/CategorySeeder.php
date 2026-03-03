<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Literatura Clásica', 'type' => 'book'],
            ['name' => 'Educación Escolar', 'type' => 'book'],
            ['name' => 'Cursos en Video', 'type' => 'course'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
