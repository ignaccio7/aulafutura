<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SubscriptionPlan extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'billing_cycle',
        'duration_days',
        'price',
        'discount_price',
        'currency',
        'features',
        'is_active',
    ];

    protected $casts = [
        'features'       => 'array',
        'price'          => 'decimal:2',
        'discount_price' => 'decimal:2',
        'is_active'      => 'boolean',
    ];

    // Devuelve el precio real (con descuento si existe)
    public function getEffectivePriceAttribute(): string
    {
        return $this->discount_price ?? $this->price;
    }

    // Solo planes activos
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
