# 🚀 Configuración Completa de Laravel Backend

## 📋 **Requisitos Previos**
- Laravel 8+ instalado
- Base de datos configurada (MySQL, PostgreSQL, etc.)
- Composer instalado

## 🛠️ **Paso 1: Crear el Modelo y Migración**

```bash
# En tu proyecto Laravel
php artisan make:model Persona -m
```

## 📊 **Paso 2: Configurar la Migración**

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
            $table->string('edad');
            $table->string('profesion');
            $table->text('direccion');
            $table->string('telefono');
            $table->text('foto')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('personas');
    }
};
```

## 🏗️ **Paso 3: Configurar el Modelo**

Edita `app/Models/Persona.php`:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Persona extends Model
{
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
    ];
}
```

## 🎮 **Paso 4: Crear el Controlador API**

```bash
php artisan make:controller Api/PersonaController --api
```

## ⚙️ **Paso 5: Configurar el Controlador**

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
    public function index(): JsonResponse
    {
        $personas = Persona::all();
        return response()->json($personas);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'nombres' => 'required|string|max:255',
            'apellidos' => 'required|string|max:255',
            'fechaNacimiento' => 'required|date',
            'edad' => 'required|string',
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

    public function show(Persona $persona): JsonResponse
    {
        return response()->json($persona);
    }

    public function update(Request $request, Persona $persona): JsonResponse
    {
        $request->validate([
            'nombres' => 'required|string|max:255',
            'apellidos' => 'required|string|max:255',
            'fechaNacimiento' => 'required|date',
            'edad' => 'required|string',
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

    public function destroy(Persona $persona): JsonResponse
    {
        $persona->delete();
        return response()->json(null, 204);
    }
}
```

## 🛣️ **Paso 6: Configurar las Rutas API**

Edita `routes/api.php`:

```php
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PersonaController;

Route::apiResource('personas', PersonaController::class);
```

## 🌐 **Paso 7: Configurar CORS**

Edita `config/cors.php`:

```php
<?php

return [
    'paths' => ['api/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:4200', 'http://localhost:4201', 'http://localhost:4202'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];
```

## 🗄️ **Paso 8: Ejecutar la Migración**

```bash
php artisan migrate
```

## 🚀 **Paso 9: Iniciar el Servidor**

```bash
php artisan serve
```

## 🧪 **Paso 10: Probar la API**

### **Endpoints Disponibles:**
- `GET /api/personas` - Obtener todas las personas
- `POST /api/personas` - Crear una nueva persona
- `GET /api/personas/{id}` - Obtener una persona específica
- `PUT /api/personas/{id}` - Actualizar una persona
- `DELETE /api/personas/{id}` - Eliminar una persona

### **Ejemplo de Datos para POST/PUT:**
```json
{
  "nombres": "Juan Carlos",
  "apellidos": "García López",
  "fechaNacimiento": "1990-05-15",
  "edad": "33",
  "profesion": "Ingeniero",
  "direccion": "Calle 123 #45-67, Bogotá",
  "telefono": "3001234567",
  "foto": ""
}
```

## 🔧 **Configuración Adicional**

### **Verificar que el middleware de CORS esté habilitado:**

En `app/Http/Kernel.php`, asegúrate de que tengas:

```php
protected $middleware = [
    // ...
    \Fruitcake\Cors\HandleCors::class,
];
```

### **Si no tienes el paquete CORS instalado:**

```bash
composer require fruitcake/laravel-cors
```

## 🚨 **Solución de Problemas Comunes**

### **Error de CORS:**
- Verifica que las rutas estén en `routes/api.php`
- Asegúrate de que CORS esté configurado correctamente
- Verifica que el middleware de CORS esté habilitado

### **Error de Conexión:**
- Verifica que Laravel esté ejecutándose en el puerto correcto
- Asegúrate de que la URL en Angular sea correcta
- Verifica que no haya problemas de firewall

### **Error de Validación:**
- Verifica que los nombres de los campos coincidan entre Angular y Laravel
- Asegúrate de que las reglas de validación sean correctas

## 🎯 **Próximos Pasos**

1. **Configurar Laravel** siguiendo esta guía
2. **Actualizar URL** en Angular si es diferente
3. **Probar endpoints** con Postman o el componente de prueba
4. **Verificar CORS** si hay problemas de conexión

¡Con esto tendrás tu API REST completamente funcional! 🎉
