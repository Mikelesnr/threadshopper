<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\ProductVariant;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // Map accessory colors to actual image filenames
        $accessoryColorImageMap = [
            'Beige' => 'products/beige.jpg',
            'Black' => 'products/black.jpg',
            'Brown' => 'products/brown.jpg',
            'Green' => 'products/green.jpg',
        ];

        Product::factory()
            ->count(30)
            ->create()
            ->each(function ($product) use ($accessoryColorImageMap) {
                $categoryName = $product->category->name;

                if ($categoryName === 'Shoes') {
                    // Shoes: numeric sizes, default product image
                    foreach (['6', '7', '8', '9', '10', '11', '12'] as $size) {
                        ProductVariant::factory()->shoes()->create([
                            'product_id' => $product->id,
                            'size'       => $size,
                            'image'      => 'products/product.png',
                            'stock'      => rand(0, 20),
                        ]);
                    }
                } elseif ($categoryName === 'Accessories') {
                    // Accessories: seed 4 color variants with matching images
                    foreach ($accessoryColorImageMap as $color => $imagePath) {
                        ProductVariant::factory()->accessory()->create([
                            'product_id' => $product->id,
                            'color'      => $color,
                            'image'      => $imagePath,
                            'stock'      => rand(0, 20),
                        ]);
                    }
                } elseif (in_array($categoryName, ['Men\'s Wear', 'Women\'s Wear'])) {
                    // Clothing: letter sizes, default product image
                    foreach (['XS', 'S', 'M', 'L', 'XL'] as $size) {
                        ProductVariant::factory()->create([
                            'product_id' => $product->id,
                            'size'       => $size,
                            'image'      => 'products/product.png',
                            'stock'      => rand(0, 20),
                        ]);
                    }
                }
            });
    }
}
