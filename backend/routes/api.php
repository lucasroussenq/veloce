<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\HealthController;
use App\Http\Controllers\Api\VehicleController;
use Illuminate\Support\Facades\Route;

Route::get('/health', HealthController::class);

Route::prefix('auth')->group(function (): void {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

Route::middleware('auth:sanctum')->group(function (): void {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/customers', [CustomerController::class, 'index']);
    Route::post('/customers', [CustomerController::class, 'store']);
    Route::get('/customers/{customer}', [CustomerController::class, 'show'])->whereNumber('customer');
    Route::put('/customers/{customer}', [CustomerController::class, 'update'])->whereNumber('customer');
    Route::delete('/customers/{customer}', [CustomerController::class, 'destroy'])->whereNumber('customer');
    Route::get('/customers/{customer}/vehicles', [VehicleController::class, 'index'])->whereNumber('customer');
    Route::post('/customers/{customer}/vehicles', [VehicleController::class, 'store'])->whereNumber('customer');
    Route::put('/customers/{customer}/vehicles/{vehicle}', [VehicleController::class, 'update'])->whereNumber(['customer', 'vehicle']);
    Route::delete('/customers/{customer}/vehicles/{vehicle}', [VehicleController::class, 'destroy'])->whereNumber(['customer', 'vehicle']);
});
