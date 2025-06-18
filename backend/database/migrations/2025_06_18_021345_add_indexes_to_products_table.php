<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // Adiciona índices apenas se não existirem
            if (!\Schema::hasColumn('products', 'name')) return;
            try {
                $table->index('name', 'products_name_index');
            } catch (\Throwable $e) {}
            try {
                $table->index('qty_stock', 'products_qty_stock_index');
            } catch (\Throwable $e) {}
            try {
                $table->index(['qty_stock', 'price'], 'products_stock_price_index');
            } catch (\Throwable $e) {}
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            try {
                $table->dropIndex('products_name_index');
            } catch (\Throwable $e) {}
            try {
                $table->dropIndex('products_qty_stock_index');
            } catch (\Throwable $e) {}
            try {
                $table->dropIndex('products_stock_price_index');
            } catch (\Throwable $e) {}
        });
    }
};
