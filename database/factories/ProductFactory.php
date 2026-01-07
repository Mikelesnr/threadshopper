<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Category;

class ProductFactory extends Factory
{
    public function definition(): array
    {
        return [
            'category_id' => Category::inRandomOrder()->first()->id ?? 1,
            'name' => $this->faker->words(2, true) . ' ' . $this->faker->randomElement([
                'T-Shirt',
                'Jeans',
                'Jacket',
                'Sneakers',
                'Dress',
                'Hoodie',
                'Cap',
                'Skirt',
                'Bag',
                'Hat',
                'Jewelry'
            ]),
            'description' => $this->faker->sentence(),
            'price' => $this->faker->randomFloat(2, 10, 200),
            'sku' => strtoupper($this->faker->unique()->bothify('SKU###??')),
            'image' => 'products/product.png',
        ];
    }
}
