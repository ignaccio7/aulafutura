<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SubscriptionPlanResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'              => $this->id,
            'name'            => $this->name,
            'slug'            => $this->slug,
            'billing_cycle'   => $this->billing_cycle,
            'duration_days'   => $this->duration_days,
            'price'           => $this->price,
            'discount_price'  => $this->discount_price,
            'effective_price' => $this->effective_price,
            'currency'        => $this->currency,
            'features'        => $this->features,
            'is_active'       => $this->is_active,
        ];
    }
}
