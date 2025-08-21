# 🔧 Arreglar Validación en Laravel

## 📋 **Problema:**
El controlador de Laravel espera campos diferentes a los que envía Angular.

## 📋 **Solución: Actualizar el Controlador de Laravel**

Edita el archivo `app/Http/Controllers/Api/PersonaController.php`:

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Persona;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PersonaController extends Controller
{
    /**
     * Obtener todas las personas
     */
    public function index(): JsonResponse
    {
        $personas = Persona::all();
        return response()->json([
            'success' => true,
            'data' => $personas
        ]);
    }

    /**
     * Crear una nueva persona
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'nombres' => 'required|string|max:255',           // Cambiado de 'nombre' a 'nombres'
            'apellidos' => 'required|string|max:255',         // Cambiado de 'apellido' a 'apellidos'
            'fechaNacimiento' => 'required|date',             // Cambiado de 'fecha_nacimiento' a 'fechaNacimiento'
            'edad' => 'required|integer|min:0|max:150',
            'profesion' => 'required|string|max:255',
            'direccion' => 'required|string',
            'telefono' => 'required|string|max:20',
            'foto' => 'nullable|string'                       // Cambiado de 'photo_url' a 'foto'
        ]);

        $persona = Persona::create([
            'nombres' => $request->nombres,                   // Cambiado
            'apellidos' => $request->apellidos,               // Cambiado
            'fecha_nacimiento' => $request->fechaNacimiento,  // Mapear fechaNacimiento a fecha_nacimiento
            'edad' => $request->edad,
            'profesion' => $request->profesion,
            'direccion' => $request->direccion,
            'telefono' => $request->telefono,
            'foto' => $request->foto                          // Cambiado
        ]);

        return response()->json([
            'success' => true,
            'data' => $persona
        ], 201);
    }

    /**
     * Obtener una persona específica
     */
    public function show(Persona $persona): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $persona
        ]);
    }

    /**
     * Actualizar una persona
     */
    public function update(Request $request, Persona $persona): JsonResponse
    {
        $request->validate([
            'nombres' => 'required|string|max:255',           // Cambiado
            'apellidos' => 'required|string|max:255',         // Cambiado
            'fechaNacimiento' => 'required|date',             // Cambiado
            'edad' => 'required|integer|min:0|max:150',
            'profesion' => 'required|string|max:255',
            'direccion' => 'required|string',
            'telefono' => 'required|string|max:20',
            'foto' => 'nullable|string'                       // Cambiado
        ]);

        $persona->update([
            'nombres' => $request->nombres,                   // Cambiado
            'apellidos' => $request->apellidos,               // Cambiado
            'fecha_nacimiento' => $request->fechaNacimiento,  // Mapear
            'edad' => $request->edad,
            'profesion' => $request->profesion,
            'direccion' => $request->direccion,
            'telefono' => $request->telefono,
            'foto' => $request->foto                          // Cambiado
        ]);

        return response()->json([
            'success' => true,
            'data' => $persona
        ]);
    }

    /**
     * Eliminar una persona
     */
    public function destroy(Persona $persona): JsonResponse
    {
        $persona->delete();
        return response()->json([
            'success' => true,
            'message' => 'Persona eliminada correctamente'
        ], 204);
    }
}
```

## 📋 **También actualizar el Modelo:**

Edita el archivo `app/Models/Persona.php`:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Persona extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombres',           // Cambiado de 'nombre' a 'nombres'
        'apellidos',         // Cambiado de 'apellido' a 'apellidos'
        'fecha_nacimiento',
        'edad',
        'profesion',
        'direccion',
        'telefono',
        'foto'               // Cambiado de 'photo_url' a 'foto'
    ];

    protected $casts = [
        'fecha_nacimiento' => 'date',
        'edad' => 'integer'
    ];
}
```

## 📋 **Verificar la Migración:**

Asegúrate de que tu migración tenga los nombres correctos:

```php
Schema::create('personas', function (Blueprint $table) {
    $table->id();
    $table->string('nombres');           // Cambiado de 'nombre' a 'nombres'
    $table->string('apellidos');         // Cambiado de 'apellido' a 'apellidos'
    $table->date('fecha_nacimiento');
    $table->integer('edad');
    $table->string('profesion');
    $table->text('direccion');
    $table->string('telefono');
    $table->string('foto')->nullable();  // Cambiado de 'photo_url' a 'foto'
    $table->timestamps();
});
```

## 📋 **Después de los cambios:**

```bash
# Limpiar caché
php artisan config:clear
php artisan route:clear
php artisan cache:clear

# Si necesitas recrear la tabla
php artisan migrate:fresh
```

## ✅ **Resultado Esperado:**

Después de estos cambios, Angular y Laravel estarán sincronizados y la validación funcionará correctamente.
