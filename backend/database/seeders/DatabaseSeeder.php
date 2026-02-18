<?php

namespace Database\Seeders;

use App\Models\TowingRequest;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

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

        $customer1 = User::create([
            'name'     => 'Ahmed Al-Rashidi',
            'email'    => 'ahmed@customer.com',
            'password' => Hash::make('password'),
            'role'     => 'customer',
        ]);

        $customer2 = User::create([
            'name'     => 'Sara Mohammed',
            'email'    => 'sara@customer.com',
            'password' => Hash::make('password'),
            'role'     => 'customer',
        ]);

        $driver1 = User::create([
            'name'     => 'Khalid Al-Otaibi',
            'email'    => 'khalid@driver.com',
            'password' => Hash::make('password'),
            'role'     => 'driver',
        ]);

        // Create demo requests
        TowingRequest::insert([
            [
                'customer_id'   => $customer1->id,
                'driver_id'     => null,
                'customer_name' => 'Ahmed Al-Rashidi',
                'location'      => 'King Fahd Road, Riyadh',
                'note'          => 'Car broke down near the gas station',
                'status'        => 'pending',
                'created_at'    => now(),
                'updated_at'    => now(),
            ],
            [
                'customer_id'   => $customer2->id,
                'driver_id'     => $driver1->id,
                'customer_name' => 'Sara Mohammed',
                'location'      => 'Olaya District, Riyadh',
                'note'          => 'Flat tire, need immediate help',
                'status'        => 'assigned',
                'created_at'    => now(),
                'updated_at'    => now(),
            ],
            [
                'customer_id'   => $customer1->id,
                'driver_id'     => null,
                'customer_name' => 'Ahmed Al-Rashidi',
                'location'      => 'Al Nakheel, Riyadh',
                'note'          => "Engine won't start",
                'status'        => 'pending',
                'created_at'    => now(),
                'updated_at'    => now(),
            ],
        ]);
    }
}
