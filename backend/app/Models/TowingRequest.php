<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TowingRequest extends Model
{

    use HasFactory;

    protected $fillable = [
        'customer_id',
        'driver_id',
        'customer_name',
        'location',
        'latitude',
        'longitude',
        'note',
        'status',
    ];

    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function driver()
    {
        return $this->belongsTo(User::class, 'driver_id');
    }
}
