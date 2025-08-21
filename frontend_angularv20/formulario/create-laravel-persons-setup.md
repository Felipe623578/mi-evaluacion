# 🚀 Configurar Laravel para Endpoint /persons

## 📋 **Problema**
Error 404: Laravel no tiene configurado el endpoint `/api/persons`.

## 🛠️ **Solución Completa**

### **Paso 1: Crear el Modelo Person**

```bash
# En tu proyecto Laravel, ejecuta:
php artisan make:model Person
```

Edita `app/Models/Person.php`:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Person extends Model
{
    use HasFactory;

    protected $table = 'persons';

    protected $fillable = [
        'first_name',
        'last_name',
        'birth_date',
        'age',
        'profession',
        'address',
        'phone',
        'email',
        'photo_url'
    ];

    protected $casts = [
        'birth_date' => 'date'
    ];
}
```

### **Paso 2: Crear el Controlador**

```bash
php artisan make:controller Api/PersonController --api
```

Edita `app/Http/Controllers/Api/PersonController.php`:

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
            'age' => 'required|string|max:3',
            'profession' => 'required|string|max:255',
            'address' => 'required|string|max:1000',
            'phone' => 'required|string|max:20',
            'email' => 'required|email|max:255',
            'photo_url' => 'nullable|string|max:500'
        ]);

        $person = Person::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'birth_date' => $request->birth_date,
            'age' => $request->age,
            'profession' => $request->profession,
            'address' => $request->address,
            'phone' => $request->phone,
            'email' => $request->email,
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
            'age' => 'required|string|max:3',
            'profession' => 'required|string|max:255',
            'address' => 'required|string|max:1000',
            'phone' => 'required|string|max:20',
            'email' => 'required|email|max:255',
            'photo_url' => 'nullable|string|max:500'
        ]);

        $person->update([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'birth_date' => $request->birth_date,
            'age' => $request->age,
            'profession' => $request->profession,
            'address' => $request->address,
            'phone' => $request->phone,
            'email' => $request->email,
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

### **Paso 3: Crear la Migración**

```bash
php artisan make:migration create_persons_table
```

Edita la migración `database/migrations/xxxx_create_persons_table.php`:

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
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->date('birth_date');
            $table->string('age', 3);
            $table->string('profession');
            $table->text('address');
            $table->string('phone');
            $table->string('email');
            $table->string('photo_url')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('persons');
    }
};
```

### **Paso 4: Configurar las Rutas**

Edita `routes/api.php`:

```php
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PersonController;

// Ruta de prueba
Route::get('/test', function () {
    return response()->json(['message' => 'API funcionando correctamente']);
});

// Rutas para persons
Route::apiResource('persons', PersonController::class);
```

### **Paso 5: Ejecutar Migración**

```bash
php artisan migrate
```

### **Paso 6: Limpiar Caché**

```bash
php artisan config:clear
php artisan route:clear
php artisan cache:clear
```

### **Paso 7: Verificar Rutas**

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

## ✅ **Verificación**

### **1. Probar GET /persons:**
```bash
curl http://localhost:8000/api/persons
```
Debería devolver: `{"success":true,"data":[]}`

### **2. Probar POST /persons:**
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "birth_date": "1990-01-01",
    "age": "33",
    "profession": "Engineer",
    "address": "123 Main Street",
    "phone": "3001234567",
    "email": "john@example.com",
    "photo_url": ""
  }' \
  http://localhost:8000/api/persons
```

Debería devolver código 201 y los datos creados.

## 🚨 **Si hay problemas**

### **A. Error de tabla no existe:**
```bash
php artisan migrate:status
php artisan migrate
```

### **B. Error de rutas no encontradas:**
```bash
php artisan route:clear
php artisan config:clear
```

### **C. Error de CORS:**
Verifica `config/cors.php`:
```php
'allowed_origins' => ['http://localhost:4207'],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
```

## 🎯 **Después de configurar Laravel**

1. **Prueba el endpoint** con curl
2. **Prueba desde Angular** en `http://localhost:4207`
3. **Verifica que funcione** el formulario completo
