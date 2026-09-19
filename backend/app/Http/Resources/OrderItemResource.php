<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'product_id' => $this->product_id,
            'product_name' => $this->product?->name,
            'product_image_url' => $this->product?->image_url,
            'quantity' => $this->quantity,
            'unit_price' => $this->unit_price,
            'subtotal' => round($this->quantity * $this->unit_price, 2),
        ];
    }
}
