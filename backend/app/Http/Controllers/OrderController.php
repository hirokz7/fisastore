<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    public function index()
    {
        try {
            $orders = Order::with(['items.product', 'customer'])
                ->orderBy('created_at', 'desc')
                ->get();
            
            Log::info('Pedidos listados', ['total' => $orders->count()]);
            
            return response()->json($orders);
            
        } catch (\Exception $e) {
            Log::error('Erro ao listar pedidos', [
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
            
            return response()->json([
                'error' => 'Erro interno do servidor',
                'message' => 'Não foi possível listar os pedidos'
            ], 500);
        }
    }

    public function show(Order $order)
    {
        try {
            Log::info('Pedido consultado', ['order_id' => $order->id]);
            
            return response()->json($order->load(['items.product', 'customer']));
            
        } catch (\Exception $e) {
            Log::error('Erro ao consultar pedido', [
                'order_id' => $order->id ?? 'N/A',
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'error' => 'Erro interno do servidor',
                'message' => 'Não foi possível consultar o pedido'
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            Log::info('Criando novo pedido', ['payload' => $request->all()]);
            
            // Validação dos dados
            $validated = $request->validate([
                'customer_name' => 'required|string|max:255',
                'delivery_date' => 'required|date',
                'items' => 'required|array|min:1',
                'items.*.product_id' => 'required|integer|exists:products,id',
                'items.*.quantity' => 'required|integer|min:1'
            ]);
            
            // Buscar ou criar cliente
            $customer = DB::table('customers')->where('name', $validated['customer_name'])->first();
            
            if ($customer) {
                $customerId = $customer->id;
                Log::info('Usando cliente existente', ['customer_id' => $customerId, 'name' => $customer->name]);
            } else {
                Log::info('Criando novo cliente', ['name' => $validated['customer_name']]);
                $customerId = DB::table('customers')->insertGetId([
                    'name' => $validated['customer_name'],
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
                Log::info('Cliente criado', ['customer_id' => $customerId]);
            }
            
            // Validar produtos e calcular valor total
            $totalValue = 0;
            $itemsToProcess = [];
            
            foreach ($validated['items'] as $item) {
                $product = Product::find($item['product_id']);
                
                if (!$product) {
                    return response()->json(['error' => 'Produto não encontrado'], 404);
                }
                
                if ($product->qty_stock < $item['quantity']) {
                    return response()->json([
                        'error' => "Estoque insuficiente para o produto {$product->name}. Disponível: {$product->qty_stock}"
                    ], 400);
                }
                
                $totalValue += $product->price * $item['quantity'];
                $itemsToProcess[] = [
                    'product' => $product,
                    'quantity' => $item['quantity']
                ];
            }
            
            // Criar pedido
            $order = Order::create([
                'customer_id' => $customerId,
                'delivery_date' => $validated['delivery_date'],
                'total_value' => $totalValue,
                'status' => 'pending'
            ]);
            
            Log::info('Pedido criado', ['order_id' => $order->id, 'total_value' => $totalValue]);
            
            // Criar itens do pedido e atualizar estoque
            foreach ($itemsToProcess as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product']->id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['product']->price
                ]);
                
                // Atualizar estoque
                $item['product']->update([
                    'qty_stock' => $item['product']->qty_stock - $item['quantity']
                ]);
                
                Log::info('Item processado', [
                    'product_id' => $item['product']->id,
                    'quantity' => $item['quantity'],
                    'new_stock' => $item['product']->qty_stock - $item['quantity']
                ]);
            }
            
            Log::info('Pedido finalizado com sucesso', ['order_id' => $order->id]);
            
            return response()->json([
                'message' => 'Pedido criado com sucesso',
                'order_id' => $order->id,
                'total_value' => $totalValue
            ], 201);
            
        } catch (\Exception $e) {
            Log::error('Erro ao criar pedido', [
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
            
            return response()->json([
                'error' => 'Erro interno do servidor',
                'message' => 'Não foi possível criar o pedido'
            ], 500);
        }
    }

    public function update(Request $request, Order $order)
    {
        try {
            Log::info('Atualizando pedido', ['order_id' => $order->id]);
            
            $validated = $request->validate([
                'items' => 'required|array|min:1',
                'items.*.product_id' => 'required|exists:products,id',
                'items.*.quantity' => 'required|integer|min:1'
            ]);

            // Validação prévia de estoque e existência do produto
            foreach ($validated['items'] as $item) {
                $product = Product::find($item['product_id']);
                $currentItem = $order->items()->where('product_id', $item['product_id'])->first();
                $currentQuantity = $currentItem ? $currentItem->quantity : 0;
                
                if (!$product) {
                    return response()->json([
                        'error' => "Produto com ID {$item['product_id']} não encontrado."
                    ], 400);
                }
                
                if ($product->qty_stock + $currentQuantity < $item['quantity']) {
                    return response()->json([
                        'error' => "Estoque insuficiente para o produto {$product->name}. Disponível: {$product->qty_stock}"
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
                
                Log::info('Item removido e estoque restaurado', [
                    'product_id' => $product->id,
                    'quantity_returned' => $item->quantity,
                    'new_stock' => $product->qty_stock + $item->quantity
                ]);
            }

            // Calculate new total value
            $totalValue = 0;
            foreach ($validated['items'] as $item) {
                $product = Product::find($item['product_id']);
                $totalValue += $product->price * $item['quantity'];
            }

            // Update order
            $order->update([
                'total_value' => $totalValue
            ]);

            // Create new items and update stock
            foreach ($validated['items'] as $item) {
                $product = Product::find($item['product_id']);

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $product->price
                ]);

                $product->update([
                    'qty_stock' => $product->qty_stock - $item['quantity']
                ]);
                
                Log::info('Novo item criado', [
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'new_stock' => $product->qty_stock - $item['quantity']
                ]);
            }

            Log::info('Pedido atualizado com sucesso', [
                'order_id' => $order->id,
                'new_total_value' => $totalValue
            ]);

            return response()->json([
                'message' => 'Pedido atualizado com sucesso',
                'order' => $order->load('items.product')
            ]);

        } catch (\Exception $e) {
            Log::error('Erro ao atualizar pedido', [
                'order_id' => $order->id ?? 'N/A',
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
            
            return response()->json([
                'error' => 'Erro interno do servidor',
                'message' => 'Não foi possível atualizar o pedido'
            ], 500);
        }
    }

    public function destroy(Order $order)
    {
        try {
            Log::info('Deletando pedido', ['order_id' => $order->id]);

            // Return items to stock
            foreach ($order->items as $item) {
                $product = $item->product;
                $product->update([
                    'qty_stock' => $product->qty_stock + $item->quantity
                ]);
                
                Log::info('Estoque restaurado', [
                    'product_id' => $product->id,
                    'quantity_returned' => $item->quantity,
                    'new_stock' => $product->qty_stock + $item->quantity
                ]);
            }

            // Remove order
            $order->delete();

            Log::info('Pedido deletado com sucesso', ['order_id' => $order->id]);

            return response()->json([
                'message' => 'Pedido deletado com sucesso'
            ]);

        } catch (\Exception $e) {
            Log::error('Erro ao deletar pedido', [
                'order_id' => $order->id ?? 'N/A',
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
            
            return response()->json([
                'error' => 'Erro interno do servidor',
                'message' => 'Não foi possível deletar o pedido'
            ], 500);
        }
    }
} 