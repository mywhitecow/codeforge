<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
// En la migración de logbooks
    public function up(): void
    {
        Schema::create('logbooks', function (Blueprint $table) {
        $table->id();
        $table->string('action');      // 'create', 'update', 'delete'
        $table->string('table_name');
        $table->ipAddress('ip_address');
        $table->char('created_at', 20); // Tu requisito de char(20)
        // SI QUIERES EL CAMPO, DEBE SER ASÍ:
        // $table->unsignedBigInteger('user_id')->nullable(); 
    });
}    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('logbooks');
    }
};
