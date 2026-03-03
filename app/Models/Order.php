<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
  protected $fillable = [
    'user_id',
    'total_amount',
    'status',
    'payment_provider',
  ];

  protected $casts = [
    'total_amount' => 'decimal:2',
  ];

  /**
   * Get the user that owns the order.
   */
  public function user(): BelongsTo
  {
    return $this->belongsTo(User::class);
  }

  /**
   * Get the items for the order.
   */
  public function items(): HasMany
  {
    return $this->hasMany(OrderItem::class);
  }
}
