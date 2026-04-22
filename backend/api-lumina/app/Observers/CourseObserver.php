<?php

namespace App\Observers;

use App\Models\Course;
use App\Models\AuditLog;

class CourseObserver
{
    // Función auxiliar privada para no repetir código
    private function logAction($action, $description, $user_id = null)
    {
        AuditLog::create([
            'user_id' => $user_id,
            'action' => $action,
            'description' => $description,
            'ip_address' => request()->ip() // Captura la IP automáticamente
        ]);
    }

    public function created(Course $course): void
    {
        // auth('sanctum')->id() obtiene al usuario de forma segura mediante el Token de Postman
        $user_id = auth('sanctum')->id(); 
        $this->logAction('course_created', "Se creó el curso: {$course->title}", $user_id);
    }

    public function updated(Course $course): void
    {
        $user_id = auth('sanctum')->id();
        $this->logAction('course_updated', "Se actualizó el curso ID: {$course->id}", $user_id);
    }

    public function deleted(Course $course): void
    {
        $user_id = auth('sanctum')->id();
        $this->logAction('course_deleted', "Se eliminó el curso: {$course->title}", $user_id);
    }
}