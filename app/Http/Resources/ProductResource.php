<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'          => $this->id,
            'name'        => $this->name,
            'description' => $this->description,
            'price'       => $this->price,
            'sku'         => $this->sku,
            'image'       => $this->image, // single default product image
            'category'    => [
                'id'   => $this->category?->id,
                'name' => $this->category?->name,
            ],
            'variants'    => $this->variants->map(function ($variant) {
                return [
                    'id'    => $variant->id,
                    'size'  => $variant->size,
                    'color' => $variant->color,
                    'image' => $variant->image,
                    'stock' => $variant->stock,
                ];
            }),
        ];
    }
}
