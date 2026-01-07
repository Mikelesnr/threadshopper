<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductVariantFactory extends Factory
{
    public function definition()
    {
        $clothingSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
        $shoeSizes = ['6', '7', '8', '9', '10', '11', '12'];

        return [
            'product_id' => Product::factory(),
            'size'       => $this->faker->randomElement($clothingSizes),
            'color'      => null,
            'image'      => null,
            'stock'      => $this->faker->numberBetween(0, 20),
        ];
    }

    public function shoes()
    {
        $colors = ['Black', 'White'];

        $colorImageMap = [
            'Black' => 'products/black.jpg',
            'White' => 'products/product.png', // fallback if you don’t have white shoe images
        ];

        $color = $this->faker->randomElement($colors);

        return $this->state(fn() => [
            'size'  => $this->faker->randomElement(['6', '7', '8', '9', '10', '11', '12']),
            'color' => $color,
            'image' => $colorImageMap[$color],
        ]);
    }

    public function accessory()
    {
        $colorImageMap = [
            'Black' => 'products/black.jpg',
            'Red'   => 'products/red.jpg',
            'Blue'  => 'products/blue.jpg',
            'Green' => 'products/green.jpg',
            'Beige' => 'products/beige.jpg',
            'Brown' => 'products/brown.jpg',
        ];

        $color = $this->faker->randomElement(array_keys($colorImageMap));

        return $this->state(fn() => [
            'size'  => null,
            'color' => $color,
            'image' => $colorImageMap[$color],
        ]);
    }
}
