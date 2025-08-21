# 🔧 Solucionar Error 422 - Validación en Laravel

## 📋 **Problema**
Angular envía datos correctos pero Laravel devuelve error 422 (Unprocessable Content).

## 🔍 **Diagnóstico**

### **1. Verificar el controlador actual**
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
     * Crear una nueva persona
     */
    public function store(Request $request): JsonResponse
    {
        // Validación más flexible
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'birth_date' => 'required|date',
            'age' => 'required|string|max:3', // Cambiar a string
            'profession' => 'required|string|max:255',
            'address' => 'required|string|max:1000', // Aumentar límite
            'phone' => 'required|string|max:20',
            'photo_url' => 'nullable|string|max:500' // Permitir rutas de archivo
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
     * Actualizar una persona
     */
    public function update(Request $request, Persona $persona): JsonResponse
    {
        // Validación más flexible
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'birth_date' => 'required|date',
            'age' => 'required|string|max:3', // Cambiar a string
            'profession' => 'required|string|max:255',
            'address' => 'required|string|max:1000', // Aumentar límite
            'phone' => 'required|string|max:20',
            'photo_url' => 'nullable|string|max:500' // Permitir rutas de archivo
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
}
```

### **2. Verificar el modelo Persona**
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
        'birth_date' => 'date',
        // NO hacer cast de age a integer, mantener como string
    ];
}
```

### **3. Verificar la migración**
Si la tabla tiene `age` como integer, actualízala:

```bash
php artisan make:migration update_personas_age_to_string
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
            // Cambiar age de integer a string
            $table->string('age', 3)->change();
        });
    }

    public function down()
    {
        Schema::table('personas', function (Blueprint $table) {
            $table->integer('age')->change();
        });
    }
};
```

### **4. Ejecutar migración**
```bash
php artisan migrate
```

### **5. Limpiar caché**
```bash
php artisan config:clear
php artisan route:clear
php artisan cache:clear
```

## 🔧 **Problemas Comunes**

### **A. Campo `age` como integer vs string**
- Angular envía `age` como string: `"35"`
- Laravel espera integer: `35`
- **Solución**: Cambiar validación a `string`

### **B. Límite de caracteres en `address`**
- Angular envía dirección larga
- Laravel tiene límite muy pequeño
- **Solución**: Aumentar límite a `max:1000`

### **C. Campo `photo_url` con rutas de archivo**
- Angular envía rutas como `C:\fakepath\hul.png`
- Laravel rechaza por formato
- **Solución**: Permitir strings largos

## ✅ **Verificación**

1. Ejecuta el script de prueba:
```bash
test-validation.bat
```

2. Debe devolver código 201 o 200, no 422

3. Prueba desde Angular nuevamente

## 🚨 **Si persiste el error**

1. **Verificar logs de Laravel**:
```bash
tail -f storage/logs/laravel.log
```

2. **Verificar estructura de la tabla**:
```bash
php artisan tinker
>>> Schema::getColumnListing('personas');
```

3. **Probar con datos mínimos**:
```bash
curl -X POST -H "Content-Type: application/json" -d "{\"first_name\":\"test\",\"last_name\":\"test\",\"birth_date\":\"1990-01-01\",\"age\":\"30\",\"profession\":\"test\",\"address\":\"test\",\"phone\":\"1234567890\"}" http://localhost:8000/api/personas
```
