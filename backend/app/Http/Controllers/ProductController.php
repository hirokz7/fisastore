<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        try {
            $page = $request->query('page', 1);
            $perPage = $request->query('per_page', 20);
            
            $products = Product::select('id', 'name', 'price', 'qty_stock')
                ->orderBy('name', 'asc') // Ordenação alfabética
                ->paginate($perPage, ['*'], 'page', $page);
            
            Log::info('Produtos listados', [
                'page' => $page,
                'per_page' => $perPage,
                'total' => $products->total()
            ]);
            
            return response()->json([
                'data' => $products->items(),
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total()
            ]);
            
        } catch (\Exception $e) {
            Log::error('Erro ao listar produtos', [
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
            
            return response()->json([
                'error' => 'Erro interno do servidor',
                'message' => 'Não foi possível listar os produtos'
            ], 500);
        }
    }

    public function show(Product $product)
    {
        try {
            Log::info('Produto consultado', ['product_id' => $product->id]);
            
            return response()->json($product);
            
        } catch (\Exception $e) {
            Log::error('Erro ao consultar produto', [
                'product_id' => $product->id ?? 'N/A',
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'error' => 'Erro interno do servidor',
                'message' => 'Não foi possível consultar o produto'
            ], 500);
        }
    }

    public function update(Request $request, Product $product)
    {
        try {
            $validated = $request->validate([
                'price' => 'required|numeric|min:0',
                'qty_stock' => 'required|integer|min:0'
            ]);

            $oldPrice = $product->price;
            $oldStock = $product->qty_stock;
            
            $product->update($validated);
            
            Log::info('Produto atualizado', [
                'product_id' => $product->id,
                'name' => $product->name,
                'old_price' => $oldPrice,
                'new_price' => $product->price,
                'old_stock' => $oldStock,
                'new_stock' => $product->qty_stock
            ]);
            
            return response()->json([
                'message' => 'Produto atualizado com sucesso',
                'product' => $product
            ]);
            
        } catch (\Exception $e) {
            Log::error('Erro ao atualizar produto', [
                'product_id' => $product->id ?? 'N/A',
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
            
            return response()->json([
                'error' => 'Erro interno do servidor',
                'message' => 'Não foi possível atualizar o produto'
            ], 500);
        }
    }
} 