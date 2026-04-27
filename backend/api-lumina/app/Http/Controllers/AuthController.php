<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Auth\Events\Registered;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{
    public function redirectToProvider($provider)
    {
        if ($provider === 'google') {
            return Socialite::driver($provider)->stateless()->with(['prompt' => 'select_account'])->redirect();
        }
        return Socialite::driver($provider)->stateless()->redirect();
    }

    public function handleProviderCallback($provider)
    {
        try {
            $socialUser = Socialite::driver($provider)->stateless()->user();
            
            // Buscamos por ID de red social o por Email
            $user = User::where($provider . '_id', $socialUser->getId())
                ->orWhere('email', $socialUser->getEmail())
                ->first();

            if (!$user) {
                // CASO 1: El usuario no existe, lo creamos desde cero
                $user = User::create([
                    'name' => $socialUser->getName(),
                    'email' => $socialUser->getEmail(),
                    'avatar_url' => $socialUser->getAvatar(),
                    $provider . '_id' => $socialUser->getId(),
                    'role_id' => 2, // Estudiante por defecto
                    'email_verified_at' => now(), // Verificación inmediata por OAuth
                ]);
            } else {
                // CASO 2: El usuario ya existe, actualizamos sus datos
                $updates = [];

                // Si no tenía el ID de esta red social, lo vinculamos
                if (!$user->{$provider . '_id'}) {
                    $updates[$provider . '_id'] = $socialUser->getId();
                }

                // Si no estaba verificado, lo marcamos como verificado ahora
                if (is_null($user->email_verified_at)) {
                    $updates['email_verified_at'] = now();
                }

                // Si hay algo que actualizar (ID social o verificación), guardamos
                if (!empty($updates)) {
                    $user->update($updates);
                }
            }
            // Iniciamos la sesión en Laravel (igual que Auth::attempt)
            // Esto es crucial para Sanctum SPA auth basado en cookies
            \Illuminate\Support\Facades\Auth::login($user);

            // Generamos el token de sesión
            $token = $user->createToken('auth_token')->plainTextToken;

            // URL-encode el token para que el | de Sanctum no rompa la URL
            return redirect('http://localhost:4200/login-success?token=' . urlencode($token));

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role_id' => 'nullable|exists:roles,id'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role_id' => $request->role_id ?? 2,
        ]);

        event(new Registered($user));

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Usuario creado exitosamente',
            'user' => $user,
            'token' => $token,
            'token_type' => 'Bearer',
        ], 201);
    }

    public function login(Request $request)
    {
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Credenciales incorrectas'], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login exitoso',
            'user' => $user,
            'token' => $token,
            'token_type' => 'Bearer'
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Sesión cerrada correctamente']);
    }

    public function me(Request $request)
    {
        $user = $request->user()->load('role', 'registrations');

        return response()->json([
            'id'               => (string) $user->id,
            'name'             => $user->name,
            'email'            => $user->email,
            'role'             => $user->role?->name ?? 'student',
            'avatarUrl'        => $user->avatar_url,
            'bio'              => $user->bio,
            'phone'            => $user->phone,
            'dateOfBirth'      => $user->date_of_birth,
            'isActive'         => $user->is_active,
            'lastLoginAt'      => $user->last_login_at,
            'createdAt'        => $user->created_at,
            // Flags de seguridad — no exponemos los IDs reales
            'hasPassword'      => !is_null($user->password),
            'hasGoogle'        => !is_null($user->google_id),
            'hasGithub'        => !is_null($user->github_id),
            'enrolledCourseIds'=> $user->registrations->pluck('course_id')->map(fn($id) => (string)$id)->values()->all(),
        ]);
    }

    public function updateProfile(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'          => 'sometimes|string|max:255',
            'phone'         => 'sometimes|nullable|string|max:30',
            'bio'           => 'sometimes|nullable|string|max:1000',
            'date_of_birth' => 'sometimes|nullable|date',
            'avatar_url'    => 'sometimes|nullable|url|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $request->user()->update(
            $request->only(['name', 'phone', 'bio', 'date_of_birth', 'avatar_url'])
        );

        return $this->me($request);
    }

    public function updatePassword(Request $request)
    {
        $user        = $request->user();
        $hasPassword = !is_null($user->password);

        // Si el usuario tiene contraseña, pedimos la actual para verificar.
        // Si vino de OAuth (password = null) solo pedimos la nueva.
        $rules = [
            'new_password'              => 'required|string|min:8|confirmed',
            'new_password_confirmation' => 'required',
        ];
        if ($hasPassword) {
            $rules['current_password'] = 'required|string';
        }

        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        if ($hasPassword && !Hash::check($request->current_password, $user->password)) {
            return response()->json(['error' => 'La contraseña actual es incorrecta.'], 422);
        }

        $user->update(['password' => Hash::make($request->new_password)]);

        return response()->json(['message' => 'Contraseña actualizada correctamente.']);
    }

    public function verify(EmailVerificationRequest $request)
    {
        $request->fulfill();
        return redirect('http://localhost:4200/login?verified=1');
    }

    public function resend(Request $request)
    {
        if ($request->user()->hasVerifiedEmail()) {
            return response()->json(['message' => 'El email ya ha sido verificado'], 400);
        }

        $request->user()->sendEmailVerificationNotification();
        return response()->json(['message' => 'Link de verificación enviado']);
    }
}