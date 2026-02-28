<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('subscription_plans', function (Blueprint $table) {
            $table->enum('billing_cycle', [
                'semanal', 'mensual', 'trimestral',
                'semestral', 'anual'
            ])->after('slug');
            $table->decimal('discount_price', 10, 2)->nullable()->after('price');
            $table->char('currency', 3)->default('USD')->after('discount_price');
            $table->json('features')->nullable()->after('currency');
            $table->boolean('is_active')->default(true)->after('features');
            $table->softDeletes()->after('updated_at');
        });
    }

    public function down(): void
    {
        Schema::table('subscription_plans', function (Blueprint $table) {
            $table->dropColumn([
                'billing_cycle',
                'discount_price',
                'currency',
                'features',
                'is_active',
            ]);
            $table->dropSoftDeletes();
        });
    }
};
