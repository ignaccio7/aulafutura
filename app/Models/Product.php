<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    //
    protected $fillable = [
        'category_id',
        'title',
        'description',
        'price',
        'type',
        'thumbnail',
        'is_active',
    ];

    // Producto pertenece a categoría
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    // Relación 1 a 1 con book_files
    public function bookFile()
    {
        return $this->hasOne(BookFile::class);
    }

    // Relación 1 a 1 con courses
    public function course()
    {
        return $this->hasOne(Course::class);
    }
}
