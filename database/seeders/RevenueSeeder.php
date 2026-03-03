<?php

namespace Database\Seeders;

use App\Models\Membership;
use App\Models\Order;
use App\Models\SubscriptionPlan;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class RevenueSeeder extends Seeder
{
  /**
   * Run the database seeds.
   */
  public function run(): void
  {
    $users = User::where('role_id', 2)->get(); // Standard users
    $plans = SubscriptionPlan::all();

    if ($users->isEmpty() || $plans->isEmpty()) {
      $this->command->warn('No hay usuarios o planes de suscripción para generar ingresos.');
      return;
    }

    $currentYear = now()->year;
    $currentMonth = now()->month;

    for ($month = 1; $month <= $currentMonth; $month++) {
      // Generar entre 2 y 5 órdenes por cada mes
      $numOrders = rand(2, 5);
      for ($i = 0; $i < $numOrders; $i++) {
        Order::create([
          'user_id' => $users->random()->id,
          'total_amount' => rand(10, 50),
          'status' => 'paid',
          'payment_provider' => 'Stripe',
          'created_at' => Carbon::create($currentYear, $month, rand(1, 28), rand(9, 18)),
        ]);
      }

      // Generar entre 1 y 3 membresías por cada mes
      $numMemberships = rand(1, 3);
      for ($i = 0; $i < $numMemberships; $i++) {
        $plan = $plans->random();
        $startDate = Carbon::create($currentYear, $month, rand(1, 28), rand(9, 18));

        Membership::create([
          'user_id' => $users->random()->id,
          'plan_id' => $plan->id,
          'start_date' => $startDate,
          'end_date' => (clone $startDate)->addDays($plan->duration_days),
          'status' => 'active',
          'created_at' => $startDate,
        ]);
      }
    }

    $this->command->info('RevenueSeeder ejecutado con éxito.');
  }
}
