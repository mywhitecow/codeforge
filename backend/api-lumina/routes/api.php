<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController; // Importamos tu controlador

// Rutas Públicas (No requieren token)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Rutas Protegidas (Requieren que el usuario haya iniciado sesión con Sanctum)
Route::middleware('auth:sanctum')->group(function () {

    // Ruta para cerrar sesión
    Route::post('/logout', [AuthController::class, 'logout']);

    // Ruta de prueba para ver los datos del usuario actual
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});
