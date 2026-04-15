<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    // 1. Función para Registrar un nuevo usuario
    public function register(Request $request)
    {
        // Validamos que el frontend nos envíe los datos correctos
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role_id' => 'required|exists:roles,id' // Debe existir un rol válido
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        // Creamos al usuario en la base de datos de PostgreSQL
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password), // Encriptamos la contraseña
            'role_id' => $request->role_id,
        ]);

        // Generamos el token de seguridad con Sanctum
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Usuario creado exitosamente',
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ], 201);
    }

    // 2. Función para Iniciar Sesión
    public function login(Request $request)
    {
        // Buscamos al usuario por su email
        $user = User::where('email', $request->email)->first();

        // Verificamos si existe y si la contraseña coincide
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Credenciales incorrectas'
            ], 401);
        }

        // Si todo está bien, le damos un nuevo pase VIP (Token)
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login exitoso',
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    // 3. Función para Cerrar Sesión (Destruir el token)
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Sesión cerrada correctamente'
        ]);
    }
}
