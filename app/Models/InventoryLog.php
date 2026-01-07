<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Product;
use App\Models\User;

class InventoryLog extends Model
{
    /** @use HasFactory<\Database\Factories\InventoryLogFactory> */
    use HasFactory;

    protected $fillable = [
        'product_id',
        'change_type',
        'quantity_before',
        'quantity_after',
        'description',
        'user_id'
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
