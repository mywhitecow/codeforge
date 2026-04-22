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
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            
            // Quién lo hizo (puede ser nulo si es un invitado o un login fallido)
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            
            // Qué hizo
            $table->string('action', 100); // Ej: 'user_login', 'course_created'
            $table->text('description')->nullable(); // Detalles extra
            
            // Desde dónde (Datos técnicos)
            $table->string('ip_address', 45)->nullable();
            
            $table->timestamps(); // Esto nos da el "Cuándo" automáticamente
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
