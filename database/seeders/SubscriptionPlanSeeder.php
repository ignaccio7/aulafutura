<?php

namespace Database\Seeders;

use App\Models\SubscriptionPlan;
use Illuminate\Database\Seeder;

class SubscriptionPlanSeeder extends Seeder
{
    public function run(): void
    {
        SubscriptionPlan::insert([
            [
                'name'           => 'Explorador',
                'slug'           => 'basico',
                'billing_cycle'  => 'trimestral',
                'duration_days'  => 90,
                'price'          => 19.99,
                'discount_price' => null,
                'currency'       => 'USD',
                'features'       => json_encode([
                    ['text' => 'Acceso a 5 libros PDF', 'icon' => 'book'],
                    ['text' => '2 Cursos básicos', 'icon' => 'video'],
                    ['text' => 'Soporte por email', 'icon' => 'mail'],
                    ['text' => 'Certificado digital', 'icon' => 'award'],
                ]),
                'is_active'      => true,
                'created_at'     => now(),
                'updated_at'     => now(),
            ],
            [
                'name'           => 'Aventura',
                'slug'           => 'plus',
                'billing_cycle'  => 'semestral',
                'duration_days'  => 180,
                'price'          => 35.00,
                'discount_price' => null,
                'currency'       => 'USD',
                'features'       => json_encode([
                    ['text' => 'Todos los libros PDF', 'icon' => 'book'],
                    ['text' => '5 Cursos interactivos', 'icon' => 'video'],
                    ['text' => 'Acceso a webinars', 'icon' => 'globe'],
                    ['text' => 'Soporte prioritario', 'icon' => 'headphones'],
                    ['text' => 'Comunidad de padres', 'icon' => 'users'],
                ]),
                'is_active'      => true,
                'created_at'     => now(),
                'updated_at'     => now(),
            ],
            [
                'name'           => 'Maestro',
                'slug'           => 'premium',
                'billing_cycle'  => 'anual',
                'duration_days'  => 365,
                'price'          => 59.99,
                'discount_price' => null,
                'currency'       => 'USD',
                'features'       => json_encode([
                    ['text' => 'Acceso ILIMITADO total', 'icon' => 'infinity'],
                    ['text' => 'Todos los cursos nuevos', 'icon' => 'video'],
                    ['text' => 'Mentoría 1 a 1', 'icon' => 'user'],
                    ['text' => 'Material físico incluido', 'icon' => 'package'],
                    ['text' => 'Acceso anticipado', 'icon' => 'zap'],
                ]),
                'is_active'      => true,
                'created_at'     => now(),
                'updated_at'     => now(),
            ],
        ]);
    }
}
