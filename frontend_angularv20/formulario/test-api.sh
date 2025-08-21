#!/bin/bash

# Script para probar la API REST de Laravel
# Asegúrate de que Laravel esté ejecutándose en http://localhost:8000

API_BASE_URL="http://localhost:8000/api"
PERSONAS_ENDPOINT="$API_BASE_URL/personas"

echo "🧪 Iniciando pruebas de API REST..."
echo "=================================="
echo ""

# Función para mostrar resultados
show_result() {
    if [ $1 -eq 0 ]; then
        echo "✅ $2"
    else
        echo "❌ $2"
    fi
    echo ""
}

# 1. Probar GET - Obtener todas las personas
echo "1. Probando GET /api/personas..."
response=$(curl -s -w "%{http_code}" "$PERSONAS_ENDPOINT")
http_code="${response: -3}"
body="${response%???}"

if [ "$http_code" -eq 200 ]; then
    show_result 0 "GET /api/personas - Éxito (HTTP $http_code)"
    echo "Respuesta: $body" | jq '.' 2>/dev/null || echo "Respuesta: $body"
else
    show_result 1 "GET /api/personas - Error (HTTP $http_code)"
    echo "Respuesta: $body"
fi
echo ""

# 2. Probar POST - Crear una nueva persona
echo "2. Probando POST /api/personas..."
test_data='{
  "nombres": "Test",
  "apellidos": "Usuario",
  "fechaNacimiento": "1990-01-01",
  "edad": "33",
  "profesion": "Desarrollador",
  "direccion": "Calle Test #123",
  "telefono": "3001234567",
  "foto": ""
}'

response=$(curl -s -w "%{http_code}" -X POST "$PERSONAS_ENDPOINT" \
    -H "Content-Type: application/json" \
    -d "$test_data")

http_code="${response: -3}"
body="${response%???}"

if [ "$http_code" -eq 201 ] || [ "$http_code" -eq 200 ]; then
    show_result 0 "POST /api/personas - Éxito (HTTP $http_code)"
    echo "Respuesta: $body" | jq '.' 2>/dev/null || echo "Respuesta: $body"
    
    # Extraer ID de la persona creada para pruebas posteriores
    persona_id=$(echo "$body" | jq -r '.id' 2>/dev/null)
    if [ "$persona_id" != "null" ] && [ "$persona_id" != "" ]; then
        echo "ID de persona creada: $persona_id"
    fi
else
    show_result 1 "POST /api/personas - Error (HTTP $http_code)"
    echo "Respuesta: $body"
fi
echo ""

# 3. Probar GET - Obtener una persona específica (si se creó una)
if [ ! -z "$persona_id" ] && [ "$persona_id" != "null" ]; then
    echo "3. Probando GET /api/personas/$persona_id..."
    response=$(curl -s -w "%{http_code}" "$PERSONAS_ENDPOINT/$persona_id")
    http_code="${response: -3}"
    body="${response%???}"

    if [ "$http_code" -eq 200 ]; then
        show_result 0 "GET /api/personas/$persona_id - Éxito (HTTP $http_code)"
        echo "Respuesta: $body" | jq '.' 2>/dev/null || echo "Respuesta: $body"
    else
        show_result 1 "GET /api/personas/$persona_id - Error (HTTP $http_code)"
        echo "Respuesta: $body"
    fi
    echo ""

    # 4. Probar PUT - Actualizar la persona
    echo "4. Probando PUT /api/personas/$persona_id..."
    update_data='{
      "nombres": "Test Actualizado",
      "apellidos": "Usuario Modificado",
      "fechaNacimiento": "1990-01-01",
      "edad": "34",
      "profesion": "Desarrollador Senior",
      "direccion": "Calle Test Actualizada #456",
      "telefono": "3001234567",
      "foto": ""
    }'

    response=$(curl -s -w "%{http_code}" -X PUT "$PERSONAS_ENDPOINT/$persona_id" \
        -H "Content-Type: application/json" \
        -d "$update_data")

    http_code="${response: -3}"
    body="${response%???}"

    if [ "$http_code" -eq 200 ]; then
        show_result 0 "PUT /api/personas/$persona_id - Éxito (HTTP $http_code)"
        echo "Respuesta: $body" | jq '.' 2>/dev/null || echo "Respuesta: $body"
    else
        show_result 1 "PUT /api/personas/$persona_id - Error (HTTP $http_code)"
        echo "Respuesta: $body"
    fi
    echo ""

    # 5. Probar DELETE - Eliminar la persona
    echo "5. Probando DELETE /api/personas/$persona_id..."
    response=$(curl -s -w "%{http_code}" -X DELETE "$PERSONAS_ENDPOINT/$persona_id")
    http_code="${response: -3}"
    body="${response%???}"

    if [ "$http_code" -eq 204 ] || [ "$http_code" -eq 200 ]; then
        show_result 0 "DELETE /api/personas/$persona_id - Éxito (HTTP $http_code)"
    else
        show_result 1 "DELETE /api/personas/$persona_id - Error (HTTP $http_code)"
        echo "Respuesta: $body"
    fi
    echo ""
else
    echo "⚠️  No se pudo obtener ID de persona para pruebas de GET, PUT y DELETE"
    echo ""
fi

# 6. Probar GET final para verificar estado
echo "6. Verificando estado final con GET /api/personas..."
response=$(curl -s -w "%{http_code}" "$PERSONAS_ENDPOINT")
http_code="${response: -3}"
body="${response%???}"

if [ "$http_code" -eq 200 ]; then
    show_result 0 "GET final /api/personas - Éxito (HTTP $http_code)"
    echo "Estado final de la base de datos:"
    echo "$body" | jq '.' 2>/dev/null || echo "$body"
else
    show_result 1 "GET final /api/personas - Error (HTTP $http_code)"
    echo "Respuesta: $body"
fi
echo ""

echo "🏁 Pruebas completadas!"
echo "======================"
echo ""
echo "📋 Resumen de códigos HTTP esperados:"
echo "   GET /personas: 200"
echo "   POST /personas: 201"
echo "   GET /personas/{id}: 200"
echo "   PUT /personas/{id}: 200"
echo "   DELETE /personas/{id}: 204"
echo ""
echo "💡 Si ves errores, verifica:"
echo "   - Laravel esté ejecutándose en http://localhost:8000"
echo "   - Las rutas estén configuradas en routes/api.php"
echo "   - CORS esté configurado correctamente"
echo "   - La base de datos esté conectada"
