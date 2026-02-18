<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\TowingRequestController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);

    Route::get('/requests',  [TowingRequestController::class, 'index']);
    Route::post('/requests', [TowingRequestController::class, 'store']);

    Route::patch('/requests/{id}/accept',   [TowingRequestController::class, 'accept']);
    Route::patch('/requests/{id}/complete', [TowingRequestController::class, 'complete']);
});
