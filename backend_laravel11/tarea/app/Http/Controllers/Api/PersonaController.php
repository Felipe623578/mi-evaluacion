<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Persona;
use Illuminate\Http\Request;

class PersonaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $personas = Persona::all();
        return response()->json([
            'success' => true,
            'data' => $personas
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:persons',
            'birth_date' => 'nullable|date',
            'age' => 'nullable|string|max:3',
            'profession' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:1000',
            'phone' => 'nullable|string|max:20',
            'photo_url' => 'nullable|string|max:500'
        ]);

        $persona = Persona::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Person created successfully',
            'data' => $persona
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $persona = Persona::find($id);
        
        if (!$persona) {
            return response()->json([
                'success' => false,
                'message' => 'Person not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $persona
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $persona = Persona::find($id);
        
        if (!$persona) {
            return response()->json([
                'success' => false,
                'message' => 'Person not found'
            ], 404);
        }

        $validated = $request->validate([
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:persons,email,' . $id,
            'birth_date' => 'nullable|date',
            'age' => 'nullable|string|max:3',
            'profession' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:1000',
            'phone' => 'nullable|string|max:20',
            'photo_url' => 'nullable|string|max:500'
        ]);

        $persona->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Person updated successfully',
            'data' => $persona
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $persona = Persona::find($id);
        
        if (!$persona) {
            return response()->json([
                'success' => false,
                'message' => 'Person not found'
            ], 404);
        }

        $persona->delete();

        return response()->json([
            'success' => true,
            'message' => 'Person deleted successfully'
        ]);
    }
}
