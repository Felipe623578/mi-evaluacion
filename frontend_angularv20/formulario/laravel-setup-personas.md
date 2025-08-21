# 🚀 Configuración del Endpoint `/personas` en Laravel

## 📋 **Paso 1: Crear Modelo y Migración**

```bash
# En tu proyecto Laravel, ejecuta:
php artisan make:model Persona -m
```

## 📋 **Paso 2: Configurar la Migración**

Edita el archivo `database/migrations/xxxx_create_personas_table.php`:

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('personas', function (Blueprint $table) {
            $table->id();
            $table->string('nombres');
            $table->string('apellidos');
            $table->date('fecha_nacimiento');
            $table->integer('edad');
            $table->string('profesion');
            $table->text('direccion');
            $table->string('telefono');
            $table->string('foto')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('personas');
    }
};
```

## 📋 **Paso 3: Configurar el Modelo**

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
        'nombres',
        'apellidos',
        'fecha_nacimiento',
        'edad',
        'profesion',
        'direccion',
        'telefono',
        'foto'
    ];

    protected $casts = [
        'fecha_nacimiento' => 'date',
        'edad' => 'integer'
    ];
}
```

## 📋 **Paso 4: Crear el Controlador**

```bash
php artisan make:controller Api/PersonaController --api
```

## 📋 **Paso 5: Configurar el Controlador**

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
        return response()->json($personas);
    }

    /**
     * Crear una nueva persona
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'nombres' => 'required|string|max:255',
            'apellidos' => 'required|string|max:255',
            'fechaNacimiento' => 'required|date',
            'edad' => 'required|integer|min:0|max:150',
            'profesion' => 'required|string|max:255',
            'direccion' => 'required|string',
            'telefono' => 'required|string|max:20',
            'foto' => 'nullable|string'
        ]);

        $persona = Persona::create([
            'nombres' => $request->nombres,
            'apellidos' => $request->apellidos,
            'fecha_nacimiento' => $request->fechaNacimiento,
            'edad' => $request->edad,
            'profesion' => $request->profesion,
            'direccion' => $request->direccion,
            'telefono' => $request->telefono,
            'foto' => $request->foto
        ]);

        return response()->json($persona, 201);
    }

    /**
     * Obtener una persona específica
     */
    public function show(Persona $persona): JsonResponse
    {
        return response()->json($persona);
    }

    /**
     * Actualizar una persona
     */
    public function update(Request $request, Persona $persona): JsonResponse
    {
        $request->validate([
            'nombres' => 'required|string|max:255',
            'apellidos' => 'required|string|max:255',
            'fechaNacimiento' => 'required|date',
            'edad' => 'required|integer|min:0|max:150',
            'profesion' => 'required|string|max:255',
            'direccion' => 'required|string',
            'telefono' => 'required|string|max:20',
            'foto' => 'nullable|string'
        ]);

        $persona->update([
            'nombres' => $request->nombres,
            'apellidos' => $request->apellidos,
            'fecha_nacimiento' => $request->fechaNacimiento,
            'edad' => $request->edad,
            'profesion' => $request->profesion,
            'direccion' => $request->direccion,
            'telefono' => $request->telefono,
            'foto' => $request->foto
        ]);

        return response()->json($persona);
    }

    /**
     * Eliminar una persona
     */
    public function destroy(Persona $persona): JsonResponse
    {
        $persona->delete();
        return response()->json(null, 204);
    }
}
```

## 📋 **Paso 6: Configurar las Rutas**

Edita el archivo `routes/api.php`:

```php
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PersonaController;

// Ruta de prueba que ya funciona
Route::get('/test', function () {
    return response()->json(['message' => 'API funcionando correctamente']);
});

// Rutas para personas
Route::apiResource('personas', PersonaController::class);
```

## 📋 **Paso 7: Ejecutar Migraciones**

```bash
php artisan migrate
```

## 📋 **Paso 8: Verificar las Rutas**

```bash
php artisan route:list --path=api
```

Deberías ver algo como:
```
+--------+-----------+------------------------+------------------+------------------------------------------------+------------+
| Domain | Method    | URI                    | Name             | Action                                         | Middleware |
+--------+-----------+------------------------+------------------+------------------------------------------------+------------+
|        | GET|HEAD  | api/test               |                  | Closure                                        | api        |
|        | GET|HEAD  | api/personas           | personas.index   | App\Http\Controllers\Api\PersonaController@index | api        |
|        | POST      | api/personas           | personas.store   | App\Http\Controllers\Api\PersonaController@store | api        |
|        | GET|HEAD  | api/personas/{persona} | personas.show    | App\Http\Controllers\Api\PersonaController@show | api        |
|        | PUT|PATCH | api/personas/{persona} | personas.update  | App\Http\Controllers\Api\PersonaController@update | api        |
|        | DELETE    | api/personas/{persona} | personas.destroy | App\Http\Controllers\Api\PersonaController@destroy | api        |
+--------+-----------+------------------------+------------------+------------------------------------------------+------------+
```

## 🧪 **Paso 9: Probar el Endpoint**

Una vez configurado, puedes probar:

```bash
# Obtener todas las personas
curl http://localhost:8000/api/personas

# Crear una persona
curl -X POST http://localhost:8000/api/personas \
  -H "Content-Type: application/json" \
  -d '{
    "nombres": "Juan",
    "apellidos": "Pérez",
    "fechaNacimiento": "1990-01-01",
    "edad": 33,
    "profesion": "Desarrollador",
    "direccion": "Calle 123",
    "telefono": "3001234567",
    "foto": ""
  }'
```

## ✅ **Resultado Esperado**

Después de estos pasos, tu endpoint `/api/personas` debería estar disponible y funcionando correctamente con Angular.
