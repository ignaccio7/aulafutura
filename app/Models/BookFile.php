<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookFile extends Model
{
    //
    protected $fillable = [
        'product_id',
        'file_path',
    ];

    // El archivo pertenece a un producto
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
