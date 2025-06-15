<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with(['items.product', 'customer'])->get();
        return response()->json($orders);
    }

    public function show(Order $order)
    {
        return response()->json($order->load(['items.product', 'customer']));
    }

    public function store(Request $request)
    {
        $request->validate([
            'customer_name' => 'required|string',
            'delivery_date' => 'required|date',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1'
        ]);

        try {
            DB::beginTransaction();

            // Check stock
            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['product_id']);
                if ($product->qty_stock < $item['quantity']) {
                    return response()->json([
                        'message' => "Product {$product->name} doesn't have enough stock. Current stock: {$product->qty_stock}"
                    ], 400);
                }
            }

            // Create or find customer
            $customer = DB::table('customers')
                ->where('name', $request->customer_name)
                ->first();

            if (!$customer) {
                $customer = DB::table('customers')->insertGetId([
                    'name' => $request->customer_name,
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
            } else {
                $customer = $customer->id;
            }

            // Calculate total value
            $totalValue = 0;
            foreach ($request->items as $item) {
                $product = Product::find($item['product_id']);
                $totalValue += $product->price * $item['quantity'];
            }

            // Create order
            $order = Order::create([
                'customer_id' => $customer,
                'delivery_date' => $request->delivery_date,
                'total_value' => $totalValue,
                'status' => 'pending'
            ]);

            // Create order items and update stock
            foreach ($request->items as $item) {
                $product = Product::find($item['product_id']);
                
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $product->price
                ]);

                // Update stock
                $product->update([
                    'qty_stock' => $product->qty_stock - $item['quantity']
                ]);
            }

            DB::commit();

            return response()->json([
                'message' => 'Order created successfully',
                'order' => $order->load('items.product')
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error creating order',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, Order $order)
    {
        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1'
        ]);

        try {
            DB::beginTransaction();

            // Check stock
            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['product_id']);
                $currentItem = $order->items()->where('product_id', $product->id)->first();
                $currentQuantity = $currentItem ? $currentItem->quantity : 0;
                
                if ($product->qty_stock + $currentQuantity < $item['quantity']) {
                    return response()->json([
                        'message' => "Product {$product->name} doesn't have enough stock. Current stock: {$product->qty_stock}"
                    ], 400);
                }
            }

            // Remove old items and return to stock
            foreach ($order->items as $item) {
                $product = $item->product;
                $product->update([
                    'qty_stock' => $product->qty_stock + $item->quantity
                ]);
                $item->delete();
            }

            // Calculate new total value
            $totalValue = 0;
            foreach ($request->items as $item) {
                $product = Product::find($item['product_id']);
                $totalValue += $product->price * $item['quantity'];
            }

            // Update order
            $order->update([
                'total_value' => $totalValue
            ]);

            // Create new items and update stock
            foreach ($request->items as $item) {
                $product = Product::find($item['product_id']);
                
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $product->price
                ]);

                // Update stock
                $product->update([
                    'qty_stock' => $product->qty_stock - $item['quantity']
                ]);
            }

            DB::commit();

            return response()->json([
                'message' => 'Order updated successfully',
                'order' => $order->load('items.product')
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error updating order',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Order $order)
    {
        try {
            DB::beginTransaction();

            // Return items to stock
            foreach ($order->items as $item) {
                $product = $item->product;
                $product->update([
                    'qty_stock' => $product->qty_stock + $item->quantity
                ]);
            }

            // Remove order
            $order->delete();

            DB::commit();

            return response()->json([
                'message' => 'Order deleted successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error deleting order',
                'error' => $e->getMessage()
            ], 500);
        }
    }
} 