<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        return inertia('user/dashboard');
    }

    public function books()
    {
        return inertia('user/books');
    }

    public function courses()
    {
        return inertia('user/courses');
    }
}
