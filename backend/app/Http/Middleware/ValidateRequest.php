<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response;

class ValidateRequest
{
    public function handle(Request $request, Closure $next): Response
    {
        $rules = [
            'pedidos' => [
                'cliente_nome' => 'required|string|max:255',
                'data_entrega' => 'required|date|after:today',
                'itens' => 'required|array|min:1',
                'itens.*.produto_id' => 'required|exists:produtos,id',
                'itens.*.quantidade' => 'required|integer|min:1'
            ],
            'produtos' => [
                'price' => 'required|numeric|min:0',
                'qty_stock' => 'required|integer|min:0'
            ]
        ];

        $routeName = $request->route()->getName();
        $method = $request->method();

        if ($method === 'POST' && str_contains($routeName, 'pedidos')) {
            $validator = Validator::make($request->all(), $rules['pedidos']);
        } elseif ($method === 'PUT' && str_contains($routeName, 'produtos')) {
            $validator = Validator::make($request->all(), $rules['produtos']);
        }

        if (isset($validator) && $validator->fails()) {
            return response()->json([
                'message' => 'Dados inválidos',
                'errors' => $validator->errors()
            ], 422);
        }

        return $next($request);
    }
} 