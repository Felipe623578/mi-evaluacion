<?php

use App\Http\Controllers\Users;
use Illuminate\Support\Facades\Route;



////////boostrap///////////////////////////////////
Route::get('/boostrap', [Users::class, 'index']) ->name ('boostrap');
