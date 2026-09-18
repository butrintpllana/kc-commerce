<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Placeholder route to verify the admin middleware. Remove once real
    // admin-only endpoints (product/category/order management) exist.
    Route::middleware('admin')->get('/admin/ping', function (Request $request) {
        return response()->json([
            'message' => 'Admin access confirmed.',
            'user' => $request->user()->only('id', 'name', 'email', 'role'),
        ]);
    });
});
