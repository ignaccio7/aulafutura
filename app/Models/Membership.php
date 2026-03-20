<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Membership extends Model
{
  protected $fillable = [
    'user_id',
    'plan_id',
    'start_date',
    'end_date',
    'status',
    'mp_payment_id',
    'mp_preference_id',
  ];

  protected $casts = [
    'start_date' => 'date',
    'end_date' => 'date',
  ];

  /**
   * Get the user that owns the membership.
   */
  public function user(): BelongsTo
  {
    return $this->belongsTo(User::class);
  }

  /**
   * Get the plan associated with the membership.
   */
  public function plan(): BelongsTo
  {
    return $this->belongsTo(SubscriptionPlan::class, 'plan_id');
  }

  /**
   * Scope a query to only include active memberships.
   */
  public function scopeActive($query)
  {
    return $query->where('status', 'active')
      ->where('start_date', '<=', now())
      ->where('end_date', '>=', now());
  }
}
