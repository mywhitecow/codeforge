<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Logbook extends Model
{
    public $timestamps = false; // Desactivamos para manejar char(20)

    protected $fillable = [
        'action',
        'table_name',
        'ip_address',
        'created_at'
    ];
}