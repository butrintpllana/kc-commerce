<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        User::create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => 'password',
            'role' => 'admin',
        ]);

        User::create([
            'name' => 'Customer',
            'email' => 'customer@example.com',
            'password' => 'password',
            'role' => 'customer',
        ]);

        $categories = [
            'Pizza' => [
                ['name' => 'Margherita Pizza', 'description' => 'Classic tomato sauce, mozzarella, and fresh basil.', 'price' => 9.99],
                ['name' => 'Pepperoni Pizza', 'description' => 'Loaded with pepperoni and mozzarella cheese.', 'price' => 11.49],
                ['name' => 'BBQ Chicken Pizza', 'description' => 'BBQ sauce, grilled chicken, red onions, and cheese.', 'price' => 12.99],
            ],
            'Burgers' => [
                ['name' => 'Classic Cheeseburger', 'description' => 'Beef patty, cheddar cheese, lettuce, tomato, and pickles.', 'price' => 8.49],
                ['name' => 'Bacon Burger', 'description' => 'Beef patty with crispy bacon, cheese, and BBQ sauce.', 'price' => 9.99],
                ['name' => 'Veggie Burger', 'description' => 'Plant-based patty with lettuce, tomato, and vegan mayo.', 'price' => 8.99],
            ],
            'Drinks' => [
                ['name' => 'Cola', 'description' => 'Chilled 330ml can of cola.', 'price' => 1.99],
                ['name' => 'Fresh Orange Juice', 'description' => 'Freshly squeezed orange juice.', 'price' => 3.49],
            ],
            'Desserts' => [
                ['name' => 'Chocolate Brownie', 'description' => 'Rich chocolate brownie with a gooey center.', 'price' => 4.49],
                ['name' => 'Vanilla Ice Cream', 'description' => 'Two scoops of creamy vanilla ice cream.', 'price' => 3.99],
            ],
        ];

        foreach ($categories as $categoryName => $products) {
            $category = Category::create(['name' => $categoryName]);

            foreach ($products as $product) {
                Product::create([
                    'category_id' => $category->id,
                    'name' => $product['name'],
                    'description' => $product['description'],
                    'price' => $product['price'],
                    'is_active' => true,
                ]);
            }
        }
    }
}
