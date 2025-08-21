# 🔧 Actualizar Laravel para Campos en Inglés

## 📋 **Problema**
Angular está enviando campos en inglés pero Laravel espera campos en español.

## 🛠️ **Solución: Actualizar Laravel**

### **Paso 1: Verificar el controlador actual**

Edita `app/Http/Controllers/Api/PersonaController.php`:

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
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'birth_date' => 'required|date',
            'age' => 'required|string',
            'profession' => 'required|string|max:255',
            'address' => 'required|string',
            'phone' => 'required|string|max:20',
            'photo_url' => 'nullable|string'
        ]);

        $persona = Persona::create([
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
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'birth_date' => 'required|date',
            'age' => 'required|string',
            'profession' => 'required|string|max:255',
            'address' => 'required|string',
            'phone' => 'required|string|max:20',
            'photo_url' => 'nullable|string'
        ]);

        $persona->update([
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

### **Paso 2: Verificar el modelo Persona**

Edita `app/Models/Persona.php`:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Persona extends Model
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
        'birth_date' => 'date'
    ];
}
```

### **Paso 3: Verificar la migración**

Si necesitas actualizar la tabla, crea una nueva migración:

```bash
php artisan make:migration update_personas_table_english_fields
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
        Schema::table('personas', function (Blueprint $table) {
            // Renombrar columnas si es necesario
            $table->renameColumn('nombre', 'first_name');
            $table->renameColumn('apellido', 'last_name');
            $table->renameColumn('fecha_nacimiento', 'birth_date');
            $table->renameColumn('profesion', 'profession');
            $table->renameColumn('direccion', 'address');
            $table->renameColumn('telefono', 'phone');
            $table->renameColumn('foto', 'photo_url');
        });
    }

    public function down()
    {
        Schema::table('personas', function (Blueprint $table) {
            $table->renameColumn('first_name', 'nombre');
            $table->renameColumn('last_name', 'apellido');
            $table->renameColumn('birth_date', 'fecha_nacimiento');
            $table->renameColumn('profession', 'profesion');
            $table->renameColumn('address', 'direccion');
            $table->renameColumn('phone', 'telefono');
            $table->renameColumn('photo_url', 'foto');
        });
    }
};
```

### **Paso 4: Ejecutar migración**

```bash
php artisan migrate
```

### **Paso 5: Limpiar caché**

```bash
php artisan config:clear
php artisan route:clear
php artisan cache:clear
```

### **Paso 6: Probar la API**

Ejecuta el script de prueba:

```bash
chmod +x test-api-english.sh
./test-api-english.sh
```

## ✅ **Verificación**

1. **GET /api/personas** - Debe devolver `{"success":true,"data":[]}`
2. **POST /api/personas** - Debe aceptar campos en inglés
3. **Validación** - Debe validar `first_name`, `last_name`, etc.

## 🔧 **Si hay problemas**

1. **Verificar CORS** en `config/cors.php`:
```php
'allowed_origins' => ['http://localhost:4200'],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
```

2. **Verificar rutas** en `routes/api.php`:
```php
Route::apiResource('personas', PersonaController::class);
```

3. **Verificar logs**:
```bash
tail -f storage/logs/laravel.log
```
