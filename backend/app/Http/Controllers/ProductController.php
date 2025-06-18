<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        try {
            $page = $request->query('page', 1);
            $perPage = $request->query('per_page', 20);
            
            $cacheKey = "products_page_{$page}_per_{$perPage}";
            $response = null;
            try {
                $cachedResult = Cache::get($cacheKey);
                if ($cachedResult) {
                    $response = $cachedResult;
                }
            } catch (\Throwable $e) {}
            
            if (!$response) {
                $products = Product::select('id', 'name', 'price', 'qty_stock')
                    ->orderBy('name', 'asc')
                    ->paginate($perPage, ['*'], 'page', $page);
                $response = [
                    'data' => $products->items(),
                    'current_page' => $products->currentPage(),
                    'last_page' => $products->lastPage(),
                    'per_page' => $products->perPage(),
                    'total' => $products->total()
                ];
                try {
                    Cache::put($cacheKey, $response, 300);
                } catch (\Throwable $e) {}
            }
            return response()->json($response);
        } catch (\Exception $e) {
            \Log::error('Erro ao listar produtos', [
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
            $cacheKey = "product_{$product->id}";
            $cachedProduct = Cache::get($cacheKey);
            if ($cachedProduct) {
                return response()->json($cachedProduct);
            }
            $productData = $product->toArray();
            Cache::put($cacheKey, $productData, 600);
            return response()->json($productData);
        } catch (\Exception $e) {
            \Log::error('Erro ao consultar produto', [
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
            $product->update($validated);
            $this->invalidateProductCache($product->id);
            return response()->json([
                'message' => 'Produto atualizado com sucesso',
                'product' => $product
            ]);
        } catch (\Exception $e) {
            \Log::error('Erro ao atualizar produto', [
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
    
    private function invalidateProductCache($productId)
    {
        Cache::forget("product_{$productId}");
    }
} 