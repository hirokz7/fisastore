<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;

class Product extends Model
{
    protected $table = 'products';
    
    protected $fillable = [
        'name',
        'price',
        'qty_stock'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'qty_stock' => 'integer'
    ];

    /**
     * Boot do modelo para adicionar escopos globais
     */
    protected static function boot()
    {
        parent::boot();
        
        // Adicionar índice automático para consultas frequentes
        static::addGlobalScope('orderByName', function (Builder $builder) {
            $builder->orderBy('name', 'asc');
        });
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Scope para produtos em estoque
     */
    public function scopeInStock(Builder $query): Builder
    {
        return $query->where('qty_stock', '>', 0);
    }

    /**
     * Scope para produtos com estoque baixo
     */
    public function scopeLowStock(Builder $query, int $threshold = 5): Builder
    {
        return $query->where('qty_stock', '<=', $threshold)->where('qty_stock', '>', 0);
    }

    /**
     * Scope para busca por nome
     */
    public function scopeSearch(Builder $query, string $search): Builder
    {
        return $query->where('name', 'like', "%{$search}%");
    }
} 