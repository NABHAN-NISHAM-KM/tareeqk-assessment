<?php

namespace Database\Seeders;

use App\Models\TowingRequest;
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
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        TowingRequest::insert([
            [
                'customer_name' => 'Ahmed Al-Rashidi',
                'location'      => 'King Fahd Road, Riyadh',
                'note'          => 'Car broke down near the gas station',
                'status'        => 'pending',
                'created_at'    => now(),
                'updated_at'    => now(),
            ],
            [
                'customer_name' => 'Sara Mohammed',
                'location'      => 'Olaya District, Riyadh',
                'note'          => 'Flat tire, need immediate help',
                'status'        => 'assigned',
                'created_at'    => now(),
                'updated_at'    => now(),
            ],
            [
                'customer_name' => 'Khalid Al-Otaibi',
                'location'      => 'Al Nakheel, Riyadh',
                'note'          => "Engine won't start",
                'status'        => 'pending',
                'created_at'    => now(),
                'updated_at'    => now(),
            ],
        ]);
    }
}
