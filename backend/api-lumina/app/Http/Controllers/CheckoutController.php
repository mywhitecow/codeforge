<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\Checkout\Session;
use App\Models\Course;
use App\Models\User;

class CheckoutController extends Controller
{
    public function verifyEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        $exists = User::where('email', $request->email)->exists();
        if (!$exists) {
            return response()->json(['error' => 'El correo secundario no está registrado.'], 404);
        }

        return response()->json(['message' => 'Correo verificado.']);
    }

    public function createSession(Request $request, $id)
    {
        $course = Course::findOrFail($id);
        
        // Configurar la API key de Stripe
        Stripe::setApiKey(env('STRIPE_SECRET'));

        // URL del frontend a donde redirigir
        $frontendUrl = env('FRONTEND_URL', 'http://localhost:4200');

        try {
            $session = Session::create([
                'payment_method_types' => ['card'],
                'line_items' => [[
                    'price_data' => [
                        'currency' => 'usd',
                        'product_data' => [
                            'name' => $course->title,
                            'description' => $course->description,
                        ],
                        'unit_amount' => intval($course->price * 100), // En centavos
                    ],
                    'quantity' => 1,
                ]],
                'mode' => 'payment',
                'success_url' => $frontendUrl . '/payment-success?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => $frontendUrl . '/payment-cancel',
                'customer_email' => $request->user()->email,
                'metadata' => [
                    'course_id' => $course->id,
                    'user_id' => $request->user()->id,
                ],
            ]);

            return response()->json(['id' => $session->id, 'url' => $session->url]);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function createSubscriptionSession(Request $request)
    {
        $planId = $request->input('plan_id'); // e.g., 'basic', 'expert', 'expert_duo'
        $user = $request->user();

        // Evitar que el usuario se suscriba al mismo plan si ya lo tiene activo
        if ($user->plan_id === $planId && $user->plan_expires_at && now()->lessThan($user->plan_expires_at)) {
            return response()->json(['error' => 'Ya estás suscrito a este plan.'], 403);
        }
        
        // Validar segundo usuario para expert_duo
        $secondUserId = null;
        if ($planId === 'expert_duo') {
            $secondEmail = $request->input('second_email');
            if (!$secondEmail) {
                return response()->json(['error' => 'Se requiere un segundo correo para este plan.'], 400);
            }
            if ($secondEmail === $user->email) {
                return response()->json(['error' => 'No puedes usar tu propio correo como correo secundario.'], 400);
            }
            $secondUser = User::where('email', $secondEmail)->first();
            if (!$secondUser) {
                return response()->json(['error' => 'El correo secundario no está registrado.'], 400);
            }
            $secondUserId = $secondUser->id;
        }

        // Define plans dummy data
        $plans = [
            'basic' => ['name' => 'Plan Basic', 'price' => 39, 'interval' => 'month'],
            'expert' => ['name' => 'Plan Expert', 'price' => 249, 'interval' => 'year'],
            'expert_duo' => ['name' => 'Plan Expert Duo', 'price' => 349, 'interval' => 'year'],
        ];

        if (!array_key_exists($planId, $plans)) {
            return response()->json(['error' => 'Plan not found'], 404);
        }

        $plan = $plans[$planId];

        Stripe::setApiKey(env('STRIPE_SECRET'));
        $frontendUrl = env('FRONTEND_URL', 'http://localhost:4200');

        try {
            $session = Session::create([
                'payment_method_types' => ['card'],
                'line_items' => [[
                    'price_data' => [
                        'currency' => 'usd',
                        'product_data' => [
                            'name' => $plan['name'],
                        ],
                        'unit_amount' => intval($plan['price'] * 100),
                        'recurring' => [
                            'interval' => $plan['interval'],
                        ],
                    ],
                    'quantity' => 1,
                ]],
                'mode' => 'subscription',
                'success_url' => $frontendUrl . '/payment-success?session_id={CHECKOUT_SESSION_ID}&plan=' . $planId,
                'cancel_url' => $frontendUrl . '/premium?payment=cancelled',
                'customer_email' => $request->user()->email,
                'metadata' => [
                    'plan_id' => $planId,
                    'user_id' => $request->user()->id,
                    'second_user_id' => $secondUserId,
                ],
            ]);

            return response()->json(['id' => $session->id, 'url' => $session->url]);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function verifySubscriptionSession(Request $request)
    {
        $sessionId = $request->input('session_id');
        $planId = $request->input('plan_id');
        $user = $request->user();

        if (!$sessionId) {
            return response()->json(['error' => 'No session ID provided'], 400);
        }

        Stripe::setApiKey(env('STRIPE_SECRET'));

        try {
            $session = Session::retrieve($sessionId);

            // Verificamos que se pagó la sesión
            if ($session->payment_status === 'paid') {
                // Actualizamos el usuario
                $interval = $planId === 'basic' ? '1 month' : '1 year';
                $expiresAt = now()->add($interval);

                $user->update([
                    'plan_id' => $planId,
                    'plan_expires_at' => $expiresAt
                ]);

                // Asignar el plan al segundo usuario si existe
                if (isset($session->metadata->second_user_id) && $session->metadata->second_user_id) {
                    $secondUser = User::find($session->metadata->second_user_id);
                    if ($secondUser) {
                        $secondUser->update([
                            'plan_id' => $planId,
                            'plan_expires_at' => $expiresAt
                        ]);
                    }
                }

                return response()->json([
                    'success' => true,
                    'message' => 'Subscription verified successfully',
                    'plan_id' => $user->plan_id,
                    'plan_expires_at' => $user->plan_expires_at
                ]);
            }

            return response()->json(['error' => 'Payment not completed'], 400);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
