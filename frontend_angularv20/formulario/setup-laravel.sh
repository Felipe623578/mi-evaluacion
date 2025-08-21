#!/bin/bash

# Script para configurar Laravel como backend para la API REST
# Ejecutar desde la raíz de tu proyecto Laravel

echo "🚀 Configurando Laravel como Backend para API REST..."
echo "=================================================="
echo ""

# Colores para la consola
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar mensajes
show_message() {
    echo -e "${GREEN}✅ $1${NC}"
}

show_error() {
    echo -e "${RED}❌ $1${NC}"
}

show_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

show_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Verificar si estamos en un proyecto Laravel
if [ ! -f "artisan" ]; then
    show_error "No se encontró el archivo artisan. Asegúrate de estar en la raíz de tu proyecto Laravel."
    exit 1
fi

show_info "1. Creando modelo y migración para Persona..."
php artisan make:model Persona -m
show_message "Modelo y migración creados"

show_info "2. Creando controlador API para Persona..."
php artisan make:controller Api/PersonaController --api
show_message "Controlador API creado"

show_info "3. Verificando si el paquete CORS está instalado..."
if ! composer show fruitcake/laravel-cors > /dev/null 2>&1; then
    show_warning "Paquete CORS no encontrado. Instalando..."
    composer require fruitcake/laravel-cors
    show_message "Paquete CORS instalado"
else
    show_message "Paquete CORS ya está instalado"
fi

show_info "4. Creando archivos de configuración..."

# Crear la migración
cat > database/migrations/$(date +%Y_%m_%d_%H%M%S)_create_personas_table.php << 'EOF'
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
EOF

# Actualizar el modelo
cat > app/Models/Persona.php << 'EOF'
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
EOF

# Actualizar el controlador
cat > app/Http/Controllers/Api/PersonaController.php << 'EOF'
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
EOF

# Actualizar las rutas API
cat > routes/api.php << 'EOF'
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PersonaController;

Route::apiResource('personas', PersonaController::class);
EOF

# Actualizar configuración CORS
cat > config/cors.php << 'EOF'
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
EOF

show_message "Archivos de configuración creados"

show_info "5. Ejecutando migraciones..."
php artisan migrate
show_message "Migraciones ejecutadas"

show_info "6. Limpiando caché..."
php artisan config:clear
php artisan route:clear
php artisan cache:clear
show_message "Caché limpiado"

show_info "7. Verificando rutas..."
php artisan route:list --path=api
show_message "Rutas verificadas"

echo ""
echo "🎉 ¡Configuración completada!"
echo "=============================="
echo ""
echo "📋 Próximos pasos:"
echo "1. Inicia el servidor: php artisan serve"
echo "2. Verifica que Angular esté configurado para http://localhost:8000/api"
echo "3. Prueba los endpoints con Postman o el componente de prueba"
echo ""
echo "🌐 Endpoints disponibles:"
echo "   GET    /api/personas"
echo "   POST   /api/personas"
echo "   GET    /api/personas/{id}"
echo "   PUT    /api/personas/{id}"
echo "   DELETE /api/personas/{id}"
echo ""
echo "🚀 Para iniciar el servidor:"
echo "   php artisan serve"
echo ""
echo "🧪 Para probar la API:"
echo "   curl http://localhost:8000/api/personas"
