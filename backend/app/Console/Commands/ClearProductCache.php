<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;

class ClearProductCache extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cache:clear-products {--all : Clear all product cache}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clear product cache for better performance';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🔄 Limpando cache de produtos...');

        if ($this->option('all')) {
            // Limpar todo cache relacionado a produtos
            $this->clearAllProductCache();
        } else {
            // Limpar apenas cache específico
            $this->clearSpecificProductCache();
        }

        $this->info('✅ Cache de produtos limpo com sucesso!');
        
        return Command::SUCCESS;
    }

    /**
     * Limpar todo cache relacionado a produtos
     */
    private function clearAllProductCache()
    {
        $keys = Cache::get('product_cache_keys', []);
        
        foreach ($keys as $key) {
            Cache::forget($key);
        }
        
        Cache::forget('product_cache_keys');
        
        $this->info('🗑️  Todo cache de produtos foi removido.');
    }

    /**
     * Limpar cache específico de produtos
     */
    private function clearSpecificProductCache()
    {
        // Limpar cache de listagem de produtos
        $this->clearProductListCache();
        
        // Limpar cache de produtos individuais
        $this->clearIndividualProductCache();
        
        $this->info('🧹 Cache específico de produtos foi limpo.');
    }

    /**
     * Limpar cache de listagem de produtos
     */
    private function clearProductListCache()
    {
        // Limpar cache de páginas de produtos
        for ($page = 1; $page <= 10; $page++) {
            for ($perPage = 10; $perPage <= 50; $perPage += 10) {
                $cacheKey = "products_page_{$page}_per_{$perPage}";
                Cache::forget($cacheKey);
            }
        }
        
        $this->line('📄 Cache de listagem de produtos limpo.');
    }

    /**
     * Limpar cache de produtos individuais
     */
    private function clearIndividualProductCache()
    {
        // Buscar todos os IDs de produtos e limpar cache individual
        $productIds = \App\Models\Product::pluck('id');
        
        foreach ($productIds as $id) {
            $cacheKey = "product_{$id}";
            Cache::forget($cacheKey);
        }
        
        $this->line('📦 Cache de produtos individuais limpo.');
    }
}
