<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
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
        'icon',
        'discount_price',
        'currency',
        'features',
        'is_active',
    ];

    protected $casts = [
        'features' => 'array',
        'price' => 'decimal:2',
        'discount_price' => 'decimal:2',
        'is_active' => 'boolean',
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

    public function memberships()
    {
        return $this->hasMany(Membership::class, 'plan_id');
    }

    //************************************************************ */

    // ──────────────────────────────────────────────
    //  Relaciones
    // ──────────────────────────────────────────────

    /** Productos (libros y cursos) incluidos en este plan */
    public function products(): BelongsToMany
    {
        return $this->belongsToMany(
            Product::class,
            'plan_products',   // tabla pivot
            'plan_id',         // FK de este modelo en la pivot
            'product_id'       // FK del modelo relacionado en la pivot
        )->withTimestamps();
    }
 
    // ──────────────────────────────────────────────
    //  Helpers
    // ──────────────────────────────────────────────

    /** Cuántos usuarios tienen este plan activo ahora mismo */
    public function getActiveMembersCountAttribute(): int
    {
        return $this->memberships()->where('status', 'active')->count();
    }
}
