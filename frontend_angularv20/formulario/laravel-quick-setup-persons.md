# 🚀 Configuración Rápida para Endpoint /persons

## 📋 **Problema**
Error 404: Laravel no tiene configurado el endpoint `/api/persons`

## ⚡ **Solución Rápida**

### **Paso 1: Crear el Modelo Person**

```bash
# En tu proyecto Laravel
php artisan make:model Person
```

### **Paso 2: Editar el Modelo**

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

### **Paso 3: Crear el Controlador**

```bash
php artisan make:controller Api/PersonController --api
```

### **Paso 4: Editar el Controlador**

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
    public function index(): JsonResponse
    {
        $persons = Person::all();
        return response()->json([
            'success' => true,
            'data' => $persons
        ]);
    }

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

        $person = Person::create($request->all());

        return response()->json([
            'success' => true,
            'data' => $person
        ], 201);
    }

    public function show(Person $person): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $person
        ]);
    }

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

        $person->update($request->all());

        return response()->json([
            'success' => true,
            'data' => $person
        ]);
    }

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

### **Paso 5: Crear la Migración**

```bash
php artisan make:migration create_persons_table
```

Edita la migración creada:

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

### **Paso 6: Configurar las Rutas**

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

### **Paso 7: Ejecutar Migración**

```bash
php artisan migrate
```

### **Paso 8: Limpiar Caché**

```bash
php artisan config:clear
php artisan route:clear
php artisan cache:clear
```

### **Paso 9: Verificar Rutas**

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

1. **Ejecuta el script de prueba:**
   ```bash
   check-laravel-routes.bat
   ```

2. **Debería devolver código 200 para `/api/persons`**

3. **Prueba desde Angular nuevamente**

## 🚨 **Si persiste el error**

1. **Verificar que Laravel esté ejecutándose:**
   ```bash
   php artisan serve
   ```

2. **Verificar logs:**
   ```bash
   tail -f storage/logs/laravel.log
   ```

3. **Verificar que no haya conflictos de nombres**
