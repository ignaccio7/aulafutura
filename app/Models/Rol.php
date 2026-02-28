<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rol extends Model
{
    protected $table = 'roles';
    protected $fillable = ['name'];


    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function getNombreAttribute()
    {
        return $this->name;
    }
}
