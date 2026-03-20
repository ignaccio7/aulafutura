<?php

namespace Database\Seeders;

use App\Models\SubscriptionPlan;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SubscriptionPlanSeeder extends Seeder
{
    public function run(): void
    {
        // Limpiar tabla pivot antes de recrear los planes
        DB::table('plan_products')->truncate();
        SubscriptionPlan::truncate();

        $plans = [
            [
                'name'           => 'Explorador',
                'slug'           => 'explorador',
                'icon'           => 'star',
                'billing_cycle'  => 'trimestral',
                'duration_days'  => 90,
                'price'          => 15.00,
                'discount_price' => null,
                'currency'       => 'ARS',
                'features'       => [
                    'Acceso a 1 libro digital',
                    'Contenido actualizado cada trimestre',
                    'Soporte por email',
                ],
                'is_active'      => true,
                'products'       => [1], // product_id 1
            ],
            [
                'name'           => 'Aventura',
                'slug'           => 'aventura',
                'icon'           => 'rocket',
                'billing_cycle'  => 'semestral',
                'duration_days'  => 180,
                'price'          => 25.00,
                // 'discount_price' => 20.00,
                'currency'       => 'ARS',
                'features'       => [
                    'Acceso a todos los libros del plan Explorador',
                    'Acceso a cursos introductorios',
                    'Descarga de materiales en PDF',
                    'Soporte prioritario',
                ],
                'is_active'      => true,
                'products'       => [1], // agrega más IDs cuando tengas más productos
            ],
            [
                'name'           => 'Maestro',
                'slug'           => 'maestro',
                'icon'           => 'crown',
                'billing_cycle'  => 'anual',
                'duration_days'  => 365,
                'price'          => 45.00,
                // 'discount_price' => 35.00,
                'currency'       => 'ARS',
                'features'       => [
                    'Acceso ilimitado a todos los libros',
                    'Acceso ilimitado a todos los cursos',
                    'Certificados de finalización',
                    'Acceso anticipado a nuevo contenido',
                    'Soporte 24/7 por chat',
                ],
                'is_active'      => true,
                'products'       => [1], // agrega más IDs cuando tengas más productos
            ],
        ];

        foreach ($plans as $data) {
            $productIds = $data['products'];
            unset($data['products']);

            $plan = SubscriptionPlan::create($data);

            // Asociar productos en la tabla pivot
            $plan->products()->sync($productIds);
        }

        $this->command->info('✓ 3 planes creados: Explorador, Aventura, Maestro');
    }
}
