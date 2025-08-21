# 🔧 Verificar Configuración de Tabla `persons` en Laravel

## 📋 **Problema**
Error 500 porque Angular intenta acceder a `/api/persons` pero Laravel no está configurado correctamente.

## 🔍 **Verificación en Laravel**

### **Paso 1: Verificar que la tabla existe**

```bash
# En tu proyecto Laravel, ejecuta:
php artisan tinker
```

Luego en tinker:
```php
>>> Schema::hasTable('persons')
>>> Schema::getColumnListing('persons')
>>> exit
```

### **Paso 2: Verificar el modelo**

Asegúrate de que `app/Models/Person.php` (no Persona) exista:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Person extends Model
{
    use HasFactory;

    protected $table = 'persons'; // Especificar tabla

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

### **Paso 3: Verificar el controlador**

Asegúrate de que `app/Http/Controllers/Api/PersonController.php` exista:

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Person; // Cambiar a Person
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PersonController extends Controller
{
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

### **Paso 4: Verificar las rutas**

En `routes/api.php`:

```php
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PersonController; // Cambiar a PersonController

// Ruta de prueba
Route::get('/test', function () {
    return response()->json(['message' => 'API funcionando correctamente']);
});

// Rutas para persons
Route::apiResource('persons', PersonController::class);
```

### **Paso 5: Verificar migración**

Si necesitas crear la tabla `persons`:

```bash
php artisan make:migration create_persons_table
```

Edita la migración:

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

### **Paso 6: Ejecutar migración**

```bash
php artisan migrate
```

### **Paso 7: Limpiar caché**

```bash
php artisan config:clear
php artisan route:clear
php artisan cache:clear
```

### **Paso 8: Verificar rutas**

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
   test-persons-endpoint.bat
   ```

2. **Debería devolver código 200 o 201, no 500**

3. **Prueba desde Angular nuevamente**

## 🚨 **Si persiste el error 500**

1. **Verificar logs de Laravel:**
   ```bash
   tail -f storage/logs/laravel.log
   ```

2. **Verificar que el servidor esté ejecutándose:**
   ```bash
   php artisan serve
   ```

3. **Verificar que no haya conflictos de nombres de modelos**
