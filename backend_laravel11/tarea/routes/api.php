<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Rutas públicas de la API
Route::get('/test', function () {
    return response()->json([
        'message' => 'API Laravel funcionando correctamente',
        'status' => 'success',
        'timestamp' => now()
    ]);
});

// Rutas para usuarios
Route::prefix('users')->group(function () {
    Route::get('/', function () {
        return response()->json([
            'users' => \App\Models\User::all()
        ]);
    });
    
    Route::get('/{id}', function ($id) {
        $user = \App\Models\User::find($id);
        if (!$user) {
            return response()->json(['error' => 'Usuario no encontrado'], 404);
        }
        return response()->json(['user' => $user]);
    });
    
    Route::post('/', function (Request $request) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6'
        ]);
        
        $user = \App\Models\User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password'])
        ]);
        
        return response()->json([
            'message' => 'Usuario creado exitosamente',
            'user' => $user
        ], 201);
    });
    
    Route::put('/{id}', function (Request $request, $id) {
        $user = \App\Models\User::find($id);
        if (!$user) {
            return response()->json(['error' => 'Usuario no encontrado'], 404);
        }
        
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $id
        ]);
        
        $user->update($validated);
        
        return response()->json([
            'message' => 'Usuario actualizado exitosamente',
            'user' => $user
        ]);
    });
    
    Route::delete('/{id}', function ($id) {
        $user = \App\Models\User::find($id);
        if (!$user) {
            return response()->json(['error' => 'Usuario no encontrado'], 404);
        }
        
        $user->delete();
        
        return response()->json([
            'message' => 'Usuario eliminado exitosamente'
        ]);
    });
});

// Rutas para personas
Route::apiResource('personas', \App\Http\Controllers\Api\PersonaController::class);
Route::apiResource('persons', \App\Http\Controllers\Api\PersonaController::class);
