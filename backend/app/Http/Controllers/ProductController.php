<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::select('id', 'name', 'price', 'qty_stock')->get();
        
        return response()->json($products);
    }

    public function show(Product $product)
    {
        return response()->json($product);
    }

    public function update(Request $request, Product $product)
    {
        $request->validate([
            'price' => 'required|numeric|min:0',
            'qty_stock' => 'required|integer|min:0'
        ]);

        $product->update($request->only(['price', 'qty_stock']));

        return response()->json([
            'message' => 'Product updated successfully',
            'product' => $product
        ]);
    }
} 