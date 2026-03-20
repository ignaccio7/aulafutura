<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SubscriptionPlanResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'name'           => $this->name,
            'slug'           => $this->slug,
            'icon'           => $this->icon ?? 'star',
            'billing_cycle'  => $this->billing_cycle,
            'duration_days'  => $this->duration_days,
            'price'          => (float) $this->price,
            'discount_price' => $this->discount_price ? (float) $this->discount_price : null,
            'currency'       => $this->currency ?? 'ARS',
            'features'       => collect($this->features ?? [])->map(function ($f) {
                if (is_string($f)) return $f;
                if (is_array($f) && isset($f['text'])) return $f['text'];
                return (string) $f;
            })->values()->all(),
            'is_active'      => (bool) $this->is_active,
            'products_count' => $this->whenCounted('products'),
        ];
    }
}
