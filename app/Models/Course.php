<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $fillable = [
    'product_id',
    'total_duration',
    'description',
    'requirements',
];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function lessons()
    {
        return $this->hasMany(Lesson::class);
    }
}

