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
                'name'           => 'Plan Lector',
                'slug'           => 'plan-lector',
                'billing_cycle'  => 'mensual',
                'duration_days'  => 30,
                'price'          => 15.00,
                'discount_price' => null,
                'currency'       => 'PEN',
                'features'       => json_encode([
                    ['text' => '1 novela mensual', 'icon' => 'book'],
                    ['text' => 'Cuestionario editable', 'icon' => 'edit'],
                    ['text' => 'Audiolibro', 'icon' => 'headphones'],
                    ['text' => 'Presentación interactiva', 'icon' => 'presentation'],
                    ['text' => 'Pasatiempos', 'icon' => 'gamepad'],
                ]),
                'is_active'      => true,
                'created_at'     => now(),
                'updated_at'     => now(),
            ],
            [
                'name'           => 'Plan Aula Integral',
                'slug'           => 'plan-aula-integral',
                'billing_cycle'  => 'mensual',
                'duration_days'  => 30,
                'price'          => 29.00,
                'discount_price' => null,
                'currency'       => 'PEN',
                'features'       => json_encode([
                    ['text' => 'Biblioteca literaria completa', 'icon' => 'book'],
                    ['text' => 'Todos los cuestionarios', 'icon' => 'edit'],
                    ['text' => 'Recursos interactivos', 'icon' => 'presentation'],
                    ['text' => '1 cuaderno mensual por área (rotativo)', 'icon' => 'notebook'],
                    ['text' => 'Talleres grabados básicos', 'icon' => 'video'],
                ]),
                'is_active'      => true,
                'created_at'     => now(),
                'updated_at'     => now(),
            ],
            [
                'name'           => 'Plan Escuela Futura',
                'slug'           => 'plan-escuela-futura-individual',
                'billing_cycle'  => 'mensual',
                'duration_days'  => 30,
                'price'          => 59.00,
                'discount_price' => null,
                'currency'       => 'PEN',
                'features'       => json_encode([
                    ['text' => 'Todo lo del Plan Aula Integral', 'icon' => 'package'],
                    ['text' => 'Cuadernos completos por áreas', 'icon' => 'notebook'],
                    ['text' => 'Cursos IA', 'icon' => 'cpu'],
                    ['text' => 'Talleres en vivo', 'icon' => 'video'],
                    ['text' => 'Documentos institucionales', 'icon' => 'file'],
                    ['text' => 'Soporte prioritario', 'icon' => 'headphones'],
                ]),
                'is_active'      => true,
                'created_at'     => now(),
                'updated_at'     => now(),
            ],
            [
                'name'           => 'Plan Escuela Futura Institucional',
                'slug'           => 'plan-escuela-futura-institucional',
                'billing_cycle'  => 'mensual',
                'duration_days'  => 30,
                'price'          => 159.00,
                'discount_price' => null,
                'currency'       => 'PEN',
                'features'       => json_encode([
                    ['text' => 'Todo lo del Plan Aula Integral', 'icon' => 'package'],
                    ['text' => 'Cuadernos completos por áreas', 'icon' => 'notebook'],
                    ['text' => 'Cursos IA', 'icon' => 'cpu'],
                    ['text' => 'Talleres en vivo', 'icon' => 'video'],
                    ['text' => 'Documentos institucionales', 'icon' => 'file'],
                    ['text' => 'Soporte prioritario', 'icon' => 'headphones'],
                    ['text' => 'Hasta 10 docentes', 'icon' => 'users'],
                ]),
                'is_active'      => true,
                'created_at'     => now(),
                'updated_at'     => now(),
            ],
        ]);
    }
}
