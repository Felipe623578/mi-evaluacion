#!/bin/bash

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Configurando Endpoint /personas en Laravel${NC}"

# Verificar si estamos en un proyecto Laravel
if [ ! -f "artisan" ]; then
    echo -e "${RED}❌ Error: No se encontró el archivo artisan. Asegúrate de estar en el directorio raíz de tu proyecto Laravel.${NC}"
    exit 1
fi

echo -e "${YELLOW}📋 Paso 1: Creando modelo y migración...${NC}"
php artisan make:model Persona -m

echo -e "${YELLOW}📋 Paso 2: Creando controlador API...${NC}"
php artisan make:controller Api/PersonaController --api

echo -e "${YELLOW}📋 Paso 3: Configurando migración...${NC}"

# Encontrar el archivo de migración más reciente
MIGRATION_FILE=$(find database/migrations -name "*create_personas_table.php" | sort | tail -1)

if [ -z "$MIGRATION_FILE" ]; then
    echo -e "${RED}❌ Error: No se encontró el archivo de migración${NC}"
    exit 1
fi

# Crear contenido de migración
cat > "$MIGRATION_FILE" << 'EOF'
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
EOF

echo -e "${GREEN}✅ Migración configurada: $MIGRATION_FILE${NC}"

echo -e "${YELLOW}📋 Paso 4: Configurando modelo...${NC}"

# Configurar modelo
cat > app/Models/Persona.php << 'EOF'
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
EOF

echo -e "${GREEN}✅ Modelo configurado${NC}"

echo -e "${YELLOW}📋 Paso 5: Configurando controlador...${NC}"

# Configurar controlador
cat > app/Http/Controllers/Api/PersonaController.php << 'EOF'
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
EOF

echo -e "${GREEN}✅ Controlador configurado${NC}"

echo -e "${YELLOW}📋 Paso 6: Configurando rutas...${NC}"

# Agregar rutas al archivo api.php
if ! grep -q "Route::apiResource('personas'" routes/api.php; then
    echo "" >> routes/api.php
    echo "// Rutas para personas" >> routes/api.php
    echo "Route::apiResource('personas', PersonaController::class);" >> routes/api.php
    echo -e "${GREEN}✅ Rutas agregadas${NC}"
else
    echo -e "${YELLOW}⚠️  Las rutas ya existen${NC}"
fi

echo -e "${YELLOW}📋 Paso 7: Ejecutando migraciones...${NC}"
php artisan migrate

echo -e "${YELLOW}📋 Paso 8: Limpiando caché...${NC}"
php artisan config:clear
php artisan route:clear
php artisan cache:clear

echo -e "${YELLOW}📋 Paso 9: Verificando rutas...${NC}"
php artisan route:list --path=api

echo -e "${GREEN}🎉 ¡Configuración completada!${NC}"
echo -e "${BLUE}📝 Próximos pasos:${NC}"
echo -e "1. Reinicia tu servidor Laravel: ${YELLOW}php artisan serve${NC}"
echo -e "2. Prueba el endpoint: ${YELLOW}curl http://localhost:8000/api/personas${NC}"
echo -e "3. Ve a Angular y prueba el botón '🔗 Probar Laravel'"
