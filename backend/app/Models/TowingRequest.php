<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TowingRequest extends Model
{

    use HasFactory;

    protected $fillable = [
        'customer_name',
        'location',
        'note',
        'status',
    ];
}
