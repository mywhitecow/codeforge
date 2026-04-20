<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('title', 255);
            $table->string('description', 1000);
            $table->integer('duration'); // En horas o minutos
            $table->string('level', 50);
            $table->decimal('price', 8, 2); // 8 dígitos en total, 2 decimales
            
            // Relaciones (Foreign Keys)
            $table->foreignId('category_id')->constrained('categories');
            $table->foreignId('instructor_id')->constrained('users');
            
            // Lo dejamos como un número entero por ahora porque la tabla de planes 
            // de suscripción la crearás recién en el Sprint 2
            $table->unsignedBigInteger('min_subscription_id')->nullable();

            $table->timestamps();
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
