<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Admin',
            'email' => 'admin@kc-commerce.test',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        $categories = collect([
            'Electronics',
            'Home & Kitchen',
            'Books',
            'Sports & Outdoors',
        ])->map(fn (string $name) => Category::create([
            'name' => $name,
            'slug' => Str::slug($name),
            'description' => "Products in the {$name} category.",
        ]));

        $products = [
            ['category' => 'Electronics', 'name' => 'Wireless Headphones', 'price' => 79.99, 'stock' => 40],
            ['category' => 'Electronics', 'name' => 'Bluetooth Speaker', 'price' => 49.99, 'stock' => 60],
            ['category' => 'Electronics', 'name' => '4K Streaming Stick', 'price' => 39.99, 'stock' => 100],
            ['category' => 'Home & Kitchen', 'name' => 'Stainless Steel Cookware Set', 'price' => 129.99, 'stock' => 25],
            ['category' => 'Home & Kitchen', 'name' => 'Electric Kettle', 'price' => 29.99, 'stock' => 80],
            ['category' => 'Books', 'name' => 'The Pragmatic Programmer', 'price' => 34.99, 'stock' => 50],
            ['category' => 'Books', 'name' => 'Clean Code', 'price' => 32.99, 'stock' => 50],
            ['category' => 'Sports & Outdoors', 'name' => 'Yoga Mat', 'price' => 19.99, 'stock' => 120],
            ['category' => 'Sports & Outdoors', 'name' => 'Adjustable Dumbbell Set', 'price' => 149.99, 'stock' => 15],
        ];

        foreach ($products as $product) {
            $category = $categories->firstWhere('name', $product['category']);

            Product::create([
                'category_id' => $category->id,
                'name' => $product['name'],
                'slug' => Str::slug($product['name']),
                'description' => "{$product['name']} — a great addition to your {$product['category']} collection.",
                'price' => $product['price'],
                'stock' => $product['stock'],
            ]);
        }
    }
}
