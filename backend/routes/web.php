<?php

use App\Http\Controllers\TowingRequestController;
use Illuminate\Support\Facades\Route;

Route::get('/requests',                    [TowingRequestController::class, 'index']);
Route::post('/requests',                   [TowingRequestController::class, 'store']);
Route::patch('/requests/{id}/accept',      [TowingRequestController::class, 'accept']);