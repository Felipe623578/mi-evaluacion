# 🚀 Crear Tabla `persons` en Laravel

## 📋 **Paso 1: Crear la Migración**

En tu proyecto Laravel, ejecuta:

```bash
php artisan make:migration create_persons_table
```

## 📋 **Paso 2: Configurar la Migración**

Edita el archivo `database/migrations/xxxx_create_persons_table.php`:

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('persons', function (Blueprint $table) {
            $table->id(); // Auto-incremental
            $table->string('first_name');
            $table->string('last_name');
            $table->date('birth_date');
            $table->integer('age');
            $table->string('profession');
            $table->text('address');
            $table->string('phone');
            $table->string('photo_url')->nullable();
            $table->timestamps(); // Crea created_at y updated_at automáticamente
        });
    }

    public function down()
    {
        Schema::dropIfExists('persons');
    }
};
```

## 📋 **Paso 3: Crear el Modelo**

```bash
php artisan make:model Person
```

## 📋 **Paso 4: Configurar el Modelo**

Edita el archivo `app/Models/Person.php`:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Person extends Model
{
    use HasFactory;

    protected $fillable = [
        'first_name',
        'last_name',
        'birth_date',
        'age',
        'profession',
        'address',
        'phone',
        'photo_url'
    ];

    protected $casts = [
        'birth_date' => 'date',
        'age' => 'integer'
    ];
}
```

## 📋 **Paso 5: Crear el Controlador**

```bash
php artisan make:controller Api/PersonController --api
```

## 📋 **Paso 6: Configurar el Controlador**

Edita el archivo `app/Http/Controllers/Api/PersonController.php`:

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Person;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PersonController extends Controller
{
    /**
     * Obtener todas las personas
     */
    public function index(): JsonResponse
    {
        $persons = Person::all();
        return response()->json([
            'success' => true,
            'data' => $persons
        ]);
    }

    /**
     * Crear una nueva persona
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'birth_date' => 'required|date',
            'age' => 'required|integer|min:0|max:150',
            'profession' => 'required|string|max:255',
            'address' => 'required|string',
            'phone' => 'required|string|max:20',
            'photo_url' => 'nullable|string'
        ]);

        $person = Person::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'birth_date' => $request->birth_date,
            'age' => $request->age,
            'profession' => $request->profession,
            'address' => $request->address,
            'phone' => $request->phone,
            'photo_url' => $request->photo_url
        ]);

        return response()->json([
            'success' => true,
            'data' => $person
        ], 201);
    }

    /**
     * Obtener una persona específica
     */
    public function show(Person $person): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $person
        ]);
    }

    /**
     * Actualizar una persona
     */
    public function update(Request $request, Person $person): JsonResponse
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'birth_date' => 'required|date',
            'age' => 'required|integer|min:0|max:150',
            'profession' => 'required|string|max:255',
            'address' => 'required|string',
            'phone' => 'required|string|max:20',
            'photo_url' => 'nullable|string'
        ]);

        $person->update([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'birth_date' => $request->birth_date,
            'age' => $request->age,
            'profession' => $request->profession,
            'address' => $request->address,
            'phone' => $request->phone,
            'photo_url' => $request->photo_url
        ]);

        return response()->json([
            'success' => true,
            'data' => $person
        ]);
    }

    /**
     * Eliminar una persona
     */
    public function destroy(Person $person): JsonResponse
    {
        $person->delete();
        return response()->json([
            'success' => true,
            'message' => 'Persona eliminada correctamente'
        ], 204);
    }
}
```

## 📋 **Paso 7: Configurar las Rutas**

Edita el archivo `routes/api.php`:

```php
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PersonController;

// Ruta de prueba que ya funciona
Route::get('/test', function () {
    return response()->json(['message' => 'API funcionando correctamente']);
});

// Rutas para persons
Route::apiResource('persons', PersonController::class);
```

## 📋 **Paso 8: Ejecutar Migraciones**

```bash
php artisan migrate
```

## 📋 **Paso 9: Verificar las Rutas**

```bash
php artisan route:list --path=api
```

Deberías ver:
```
| GET|HEAD  | api/persons           | persons.index   |
| POST      | api/persons           | persons.store   |
| GET|HEAD  | api/persons/{person}  | persons.show    |
| PUT|PATCH | api/persons/{person}  | persons.update  |
| DELETE    | api/persons/{person}  | persons.destroy |
```

## 🧪 **Paso 10: Probar el Endpoint**

```bash
# Obtener todas las personas
curl http://localhost:8000/api/persons

# Crear una persona
curl -X POST http://localhost:8000/api/persons \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Juan",
    "last_name": "Pérez",
    "birth_date": "1990-01-01",
    "age": 33,
    "profession": "Desarrollador",
    "address": "Calle 123",
    "phone": "3001234567",
    "photo_url": ""
  }'
```

## ✅ **Resultado Esperado**

Después de estos pasos, tu endpoint `/api/persons` estará disponible y funcionando correctamente.
