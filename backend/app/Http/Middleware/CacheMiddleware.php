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
        if ($request->isMethod('GET')) {
            $cacheKey = $this->generateCacheKey($request);
            
            if (Cache::has($cacheKey)) {
                $cachedResponse = Cache::get($cacheKey);
                return response()->json($cachedResponse);
            }
            
            $response = $next($request);
            
            if ($response->getStatusCode() === 200) {
                $responseData = json_decode($response->getContent(), true);
                Cache::put($cacheKey, $responseData, $ttl);
            }
            
            return $response;
        }
        
        return $next($request);
    }

    private function generateCacheKey(Request $request): string
    {
        $url = $request->url();
        $queryParams = $request->query();
        ksort($queryParams); 
        
        $queryString = http_build_query($queryParams);
        
        return 'http_cache_' . md5($url . '?' . $queryString);
    }
}
