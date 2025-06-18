<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

class CacheMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, $ttl = 300): Response
    {
        // Só aplicar cache em requisições GET
        if ($request->isMethod('GET')) {
            $cacheKey = $this->generateCacheKey($request);
            
            // Tentar buscar do cache
            if (Cache::has($cacheKey)) {
                $cachedResponse = Cache::get($cacheKey);
                return response()->json($cachedResponse);
            }
            
            // Se não estiver em cache, processar normalmente
            $response = $next($request);
            
            // Salvar resposta no cache se for bem-sucedida
            if ($response->getStatusCode() === 200) {
                $responseData = json_decode($response->getContent(), true);
                Cache::put($cacheKey, $responseData, $ttl);
            }
            
            return $response;
        }
        
        return $next($request);
    }
    
    /**
     * Gerar chave única para o cache baseada na requisição
     */
    private function generateCacheKey(Request $request): string
    {
        $url = $request->url();
        $queryParams = $request->query();
        ksort($queryParams); // Ordenar parâmetros para consistência
        
        $queryString = http_build_query($queryParams);
        
        return 'http_cache_' . md5($url . '?' . $queryString);
    }
}
