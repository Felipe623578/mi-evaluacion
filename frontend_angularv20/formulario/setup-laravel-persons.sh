#!/bin/bash

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Configurando Laravel para endpoint /persons${NC}"

# Verificar si estamos en un proyecto Laravel
if [ ! -f "artisan" ]; then
    echo -e "${RED}❌ Error: No se encontró el archivo artisan. Asegúrate de estar en el directorio raíz de tu proyecto Laravel.${NC}"
    exit 1
fi

echo -e "${YELLOW}📋 Paso 1: Creando modelo Person...${NC}"
php artisan make:model Person

echo -e "${YELLOW}📋 Paso 2: Creando controlador PersonController...${NC}"
php artisan make:controller Api/PersonController --api

echo -e "${YELLOW}📋 Paso 3: Creando migración...${NC}"
php artisan make:migration create_persons_table

# Encontrar el archivo de migración más reciente
MIGRATION_FILE=$(find database/migrations -name "*create_persons_table.php" | sort | tail -1)

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
EOF

echo -e "${GREEN}✅ Migración configurada: $MIGRATION_FILE${NC}"

echo -e "${YELLOW}📋 Paso 4: Configurando modelo...${NC}"

# Configurar modelo
cat > app/Models/Person.php << 'EOF'
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
EOF

echo -e "${GREEN}✅ Modelo configurado${NC}"

echo -e "${YELLOW}📋 Paso 5: Configurando controlador...${NC}"

# Configurar controlador
cat > app/Http/Controllers/Api/PersonController.php << 'EOF'
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
EOF

echo -e "${GREEN}✅ Controlador configurado${NC}"

echo -e "${YELLOW}📋 Paso 6: Configurando rutas...${NC}"

# Agregar rutas al archivo api.php
if ! grep -q "Route::apiResource('persons'" routes/api.php; then
    echo "" >> routes/api.php
    echo "// Rutas para persons" >> routes/api.php
    echo "Route::apiResource('persons', PersonController::class);" >> routes/api.php
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
echo -e "2. Prueba el endpoint: ${YELLOW}curl http://localhost:8000/api/persons${NC}"
echo -e "3. Prueba desde Angular en: ${YELLOW}http://localhost:4207${NC}"
