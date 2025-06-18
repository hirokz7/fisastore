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

 
    protected static function boot()
    {
        parent::boot();
        
        static::addGlobalScope('orderByName', function (Builder $builder) {
            $builder->orderBy('name', 'asc');
        });
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function scopeInStock(Builder $query): Builder
    {
        return $query->where('qty_stock', '>', 0);
    }

    public function scopeLowStock(Builder $query, int $threshold = 5): Builder
    {
        return $query->where('qty_stock', '<=', $threshold)->where('qty_stock', '>', 0);
    }

    public function scopeSearch(Builder $query, string $search): Builder
    {
        return $query->where('name', 'like', "%{$search}%");
    }
} 