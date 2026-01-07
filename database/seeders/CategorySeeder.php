<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Men\'s Wear', 'slug' => Str::slug('Men\'s Wear'), 'status' => 'active'],
            ['name' => 'Women\'s Wear', 'slug' => Str::slug('Women\'s Wear'), 'status' => 'active'],
            ['name' => 'Shoes', 'slug' => Str::slug('Shoes'), 'status' => 'active'],
            ['name' => 'Accessories', 'slug' => Str::slug('Accessories'), 'status' => 'active'],
        ];

        DB::table('categories')->insert($categories);
    }
}
