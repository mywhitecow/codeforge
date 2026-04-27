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
            'thumbnail_url' => 'nullable|url|max:500',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $data = $request->all();
        // Asignamos el instructor automáticamente al usuario autenticado
        $data['instructor_id'] = $request->user()->id;

        // Si todo es válido, guardamos en la base de datos
        $course = Course::create($data);

        return response()->json([
            'message' => 'Curso creado exitosamente',
            'course' => $course
        ], 201);
    }

    // 3. Ver un solo curso en específico (Por si el frontend necesita la vista de detalle)
    public function show($id)
    {
        $course = Course::with('category')->find($id);

        if (!$course) {
            return response()->json(['message' => 'Curso no encontrado'], 404);
        }

        return response()->json($course, 200);
    }

    // 4. Actualizar un curso existente
    public function update(Request $request, $id)
    {
        $course = Course::find($id);

        if (!$course) {
            return response()->json(['message' => 'Curso no encontrado'], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string|max:1000',
            'duration' => 'sometimes|required|integer', 
            'level' => 'sometimes|required|string|max:50',
            'price' => 'sometimes|required|numeric',
            'category_id' => 'sometimes|required|exists:categories,id', 
            'thumbnail_url' => 'nullable|url|max:500',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        // Solo permitir actualizar si es el dueño o es un admin
        if ($course->instructor_id !== $request->user()->id && $request->user()->role_id !== 1) {
            return response()->json(['message' => 'No tienes permiso para editar este curso'], 403);
        }

        // Actualizamos los datos
        $course->update($request->all());

        return response()->json([
            'message' => 'Curso actualizado exitosamente',
            'course' => $course
        ], 200);
    }

    // 5. Borrar un curso (Soft Delete)
    public function destroy(Request $request, $id)
    {
        $course = Course::find($id);

        if (!$course) {
            return response()->json(['message' => 'Curso no encontrado'], 404);
        }

        // Solo permitir borrar si es el dueño o es un admin
        if ($course->instructor_id !== $request->user()->id && $request->user()->role_id !== 1) {
            return response()->json(['message' => 'No tienes permiso para eliminar este curso'], 403);
        }

        // Soft Delete
        $course->update(['is_active' => false]);

        return response()->json(['message' => 'Curso desactivado correctamente'], 200);
    }
}