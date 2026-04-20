<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CourseController extends Controller
{
    // 1. Listar todos los cursos
    public function index()
    {
        $courses = Course::with('category')->get();
        return response()->json($courses, 200);
    }

    // 2. Crear un curso nuevo
    public function store(Request $request)
    {
        // Validamos estrictamente los campos
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:1000',
            'duration' => 'required|integer', 
            'level' => 'required|string|max:50',
            'price' => 'required|numeric',
            'category_id' => 'required|exists:categories,id', 
            'instructor_id' => 'required|exists:users,id', 
            'min_subscription_id' => 'nullable|exists:subscription_plans,id' 
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        // Si todo es válido, guardamos en PostgreSQL
        $course = Course::create($request->all());

        return response()->json([
            'message' => 'Curso creado exitosamente',
            'course' => $course
        ], 201);
    }
}