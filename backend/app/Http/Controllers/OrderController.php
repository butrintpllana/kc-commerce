<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderStatusRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Order::with(['items.product', 'user'])->latest();

        if ($user->isAdmin()) {
            if ($request->filled('status')) {
                $query->where('status', $request->query('status'));
            }
        } else {
            $query->where('user_id', $user->id);
        }

        return OrderResource::collection($query->paginate(15));
    }

    public function store(StoreOrderRequest $request)
    {
        $items = $request->validated('items');

        $products = Product::whereIn('id', array_column($items, 'product_id'))->get()->keyBy('id');

        foreach ($items as $item) {
            $product = $products->get($item['product_id']);

            if (! $product || ! $product->is_active) {
                throw ValidationException::withMessages([
                    'items' => ["Product \"{$item['product_id']}\" is not available."],
                ]);
            }
        }

        $order = DB::transaction(function () use ($request, $items, $products) {
            $totalPrice = 0;

            foreach ($items as $item) {
                $totalPrice += $products->get($item['product_id'])->price * $item['quantity'];
            }

            $order = Order::create([
                'user_id' => $request->user()->id,
                'status' => 'pending',
                'total_price' => $totalPrice,
            ]);

            foreach ($items as $item) {
                $product = $products->get($item['product_id']);

                $order->items()->create([
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $product->price,
                ]);
            }

            return $order;
        });

        return new OrderResource($order->load('items.product'));
    }

    public function show(Request $request, Order $order)
    {
        $this->authorize('view', $order);

        return new OrderResource($order->load('items.product'));
    }

    public function updateStatus(UpdateOrderStatusRequest $request, Order $order)
    {
        $order->update(['status' => $request->validated('status')]);

        return new OrderResource($order->load('items.product'));
    }
}
