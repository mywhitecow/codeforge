<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class InstructorUserSeeder extends Seeder
{
    public function run(): void
    {
        // role_id 3 = Instructor (según el RoleSeeder)
        User::firstOrCreate(
            ['email' => 'instructor@lumina.com'],
            [
                'role_id'           => 3,
                'name'              => 'Instructor Demo',
                'password'          => bcrypt('instructor123'),
                'email_verified_at' => now(),
                'is_active'         => true,
            ]
        );
    }
}
