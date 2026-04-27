<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Primero sembramos los roles (obligatorio)
        $this->call([
            RoleSeeder::class,
        ]);

        // 2. Creamos tu usuario Administrador (Asumiendo que el ID 1 es Admin)
        User::create([
            'role_id' => 1,
            'name' => 'Admin Lumina',
            'email' => 'admin@lumina.com',
            'password' => bcrypt('admin123'), // bcrypt encripta la contraseña
            'email_verified_at' => now(),
        ]);
    }
}
