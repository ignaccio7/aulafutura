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
            ['name' => 'Desarrollo Frontend', 'type' => 'book'],
            ['name' => 'Ingeniería de Sistemas', 'type' => 'book'],
            ['name' => 'QA y Automatización', 'type' => 'course'],
            ['name' => 'DevOps y CI/CD', 'type' => 'course'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
