<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        User::create([
            'name' => 'Administrador',
            'email' => 'admin@example.com',
            'password' => '12345678',
            'role_id' => 1,
            'is_active' => true,
            'avatar' => 'https://ui-avatars.com/api/?name=Administrador',
        ]);

        User::create([
            'name' => 'Juan Pérez',
            'email' => 'juan@example.com',
            'password' => '12345678',
            'role_id' => 2,
            'is_active' => true,
            'avatar' => 'https://ui-avatars.com/api/?name=Juan+Pérez',
        ]);

        User::create([
            'name' => 'María López',
            'email' => 'maria@example.com',
            'password' => '12345678',
            'role_id' => 2,
            'is_active' => true,
            'avatar' => 'https://ui-avatars.com/api/?name=María+López',
        ]);

        User::create([
            'name' => 'Carlos García',
            'email' => 'carlos@example.com',
            'password' => '12345678',
            'role_id' => 2,
            'is_active' => true,
            'avatar' => 'https://ui-avatars.com/api/?name=Carlos+García',
        ]);
    }
}
