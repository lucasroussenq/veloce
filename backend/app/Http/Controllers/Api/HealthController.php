<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Throwable;

class HealthController
{
    public function __invoke(): JsonResponse
    {
        try {
            DB::connection()->getPdo();
        } catch (Throwable) {
            return response()->json([
                'status' => 'degraded',
                'application' => 'ok',
                'database' => 'unavailable',
                'timestamp' => now()->toIso8601String(),
            ], 503);
        }

        return response()->json([
            'status' => 'ok',
            'application' => 'ok',
            'database' => 'ok',
            'timestamp' => now()->toIso8601String(),
        ]);
    }
}
