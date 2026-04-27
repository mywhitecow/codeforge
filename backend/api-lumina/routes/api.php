<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\RegistrationController;
use App\Http\Controllers\UserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Rutas de Autenticación agrupadas bajo el prefijo 'auth'
// Esto habilita los endpoints: /api/auth/register y /api/auth/login
Route::get('/test', function () {
    return response()->json(['message' => 'Conexión exitosa']);
});

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    // Verificación de email (Link del correo)
    Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verify'])
        ->middleware(['signed'])
        ->name('verification.verify');

    // Reenviar verificación
    Route::post('/email/verification-notification', [AuthController::class, 'resend'])
        ->middleware(['auth:sanctum', 'throttle:6,1'])
        ->name('verification.send');
});

// Rutas protegidas (Requieren token de Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    
    // Ruta de logout (Ahora será /api/auth/logout si decides usar el mismo prefijo)
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        // Perfil del usuario autenticado — usado por AuthService.loadCurrentUser()
        Route::get('/me', [AuthController::class, 'me']);
        // Edición de perfil y contraseña
        Route::put('/profile',  [AuthController::class, 'updateProfile']);
        Route::put('/password', [AuthController::class, 'updatePassword']);
    });
    
    // Rutas del CRUD de cursos (LUM-7)
    Route::apiResource('courses', CourseController::class);
    
    // Rutas del CRUD de usuarios (Solo admins, verificado en UserController)
    Route::apiResource('users', UserController::class);
    
    // Nueva ruta para inscripciones (LUM-8)
    Route::post('/courses/{id}/enroll', [RegistrationController::class, 'enroll']);
});

// Esta ruta sirve para /auth/github/redirect y /auth/google/redirect
Route::get('/auth/{provider}/redirect', [AuthController::class, 'redirectToProvider']);

// Esta ruta sirve para /auth/github/callback y /auth/google/callback
Route::get('/auth/{provider}/callback', [AuthController::class, 'handleProviderCallback']);