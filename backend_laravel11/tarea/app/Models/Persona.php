<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Persona extends Model
{
    protected $table = 'persons';
    
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'phone',
        'birth_date',
        'age',
        'profession',
        'address',
        'photo_url'
    ];

    protected $casts = [
        'birth_date' => 'date'
    ];

    // Accessor para obtener el nombre completo
    public function getFullNameAttribute()
    {
        return $this->first_name . ' ' . $this->last_name;
    }
}
