#!/bin/bash

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuración
API_BASE_URL="http://localhost:8000/api"
PERSONAS_ENDPOINT="/personas"

echo -e "${BLUE}🧪 Probando API con campos en inglés${NC}"
echo -e "${YELLOW}URL Base: ${API_BASE_URL}${NC}"
echo ""

# Función para mostrar resultados
show_result() {
    local status=$1
    local message=$2
    local details=$3
    
    if [ "$status" = "success" ]; then
        echo -e "${GREEN}✅ $message${NC}"
    else
        echo -e "${RED}❌ $message${NC}"
    fi
    
    if [ ! -z "$details" ]; then
        echo -e "${YELLOW}   $details${NC}"
    fi
    echo ""
}

# 1. Probar conexión básica
echo -e "${BLUE}1. Probando conexión básica...${NC}"
response=$(curl -s -w "%{http_code}" "${API_BASE_URL}/test")
http_code="${response: -3}"
response_body="${response%???}"

if [ "$http_code" = "200" ]; then
    show_result "success" "Conexión exitosa" "HTTP $http_code"
else
    show_result "error" "Error de conexión" "HTTP $http_code"
fi

# 2. Probar GET /personas
echo -e "${BLUE}2. Probando GET /personas...${NC}"
response=$(curl -s -w "%{http_code}" "${API_BASE_URL}${PERSONAS_ENDPOINT}")
http_code="${response: -3}"
response_body="${response%???}"

if [ "$http_code" = "200" ]; then
    show_result "success" "GET /personas exitoso" "HTTP $http_code"
    echo -e "${YELLOW}   Respuesta: $response_body${NC}"
else
    show_result "error" "Error en GET /personas" "HTTP $http_code"
fi
echo ""

# 3. Probar POST /personas con campos en inglés
echo -e "${BLUE}3. Probando POST /personas con campos en inglés...${NC}"
test_data='{
  "first_name": "John",
  "last_name": "Doe",
  "birth_date": "1990-01-01",
  "age": "33",
  "profession": "Engineer",
  "address": "123 Main Street",
  "phone": "3001234567",
  "photo_url": ""
}'

response=$(curl -s -w "%{http_code}" \
  -X POST \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d "$test_data" \
  "${API_BASE_URL}${PERSONAS_ENDPOINT}")

http_code="${response: -3}"
response_body="${response%???}"

if [ "$http_code" = "201" ] || [ "$http_code" = "200" ]; then
    show_result "success" "POST /personas exitoso" "HTTP $http_code"
    echo -e "${YELLOW}   Respuesta: $response_body${NC}"
    
    # Extraer ID si es posible
    if command -v jq &> /dev/null; then
        person_id=$(echo "$response_body" | jq -r '.data.id // .id // empty')
        if [ ! -z "$person_id" ] && [ "$person_id" != "null" ]; then
            echo -e "${GREEN}   ID creado: $person_id${NC}"
            
            # 4. Probar GET /personas/{id}
            echo -e "${BLUE}4. Probando GET /personas/$person_id...${NC}"
            get_response=$(curl -s -w "%{http_code}" "${API_BASE_URL}${PERSONAS_ENDPOINT}/$person_id")
            get_http_code="${get_response: -3}"
            get_response_body="${get_response%???}"
            
            if [ "$get_http_code" = "200" ]; then
                show_result "success" "GET /personas/$person_id exitoso" "HTTP $get_http_code"
            else
                show_result "error" "Error en GET /personas/$person_id" "HTTP $get_http_code"
            fi
            
            # 5. Probar PUT /personas/{id}
            echo -e "${BLUE}5. Probando PUT /personas/$person_id...${NC}"
            update_data='{
              "first_name": "Jane",
              "last_name": "Smith",
              "birth_date": "1990-01-01",
              "age": "34",
              "profession": "Doctor",
              "address": "456 Oak Avenue",
              "phone": "3009876543",
              "photo_url": ""
            }'
            
            put_response=$(curl -s -w "%{http_code}" \
              -X PUT \
              -H "Content-Type: application/json" \
              -H "Accept: application/json" \
              -d "$update_data" \
              "${API_BASE_URL}${PERSONAS_ENDPOINT}/$person_id")
            
            put_http_code="${put_response: -3}"
            put_response_body="${put_response%???}"
            
            if [ "$put_http_code" = "200" ]; then
                show_result "success" "PUT /personas/$person_id exitoso" "HTTP $put_http_code"
            else
                show_result "error" "Error en PUT /personas/$person_id" "HTTP $put_http_code"
                echo -e "${YELLOW}   Respuesta: $put_response_body${NC}"
            fi
            
            # 6. Probar DELETE /personas/{id}
            echo -e "${BLUE}6. Probando DELETE /personas/$person_id...${NC}"
            delete_response=$(curl -s -w "%{http_code}" \
              -X DELETE \
              -H "Accept: application/json" \
              "${API_BASE_URL}${PERSONAS_ENDPOINT}/$person_id")
            
            delete_http_code="${delete_response: -3}"
            
            if [ "$delete_http_code" = "204" ] || [ "$delete_http_code" = "200" ]; then
                show_result "success" "DELETE /personas/$person_id exitoso" "HTTP $delete_http_code"
            else
                show_result "error" "Error en DELETE /personas/$person_id" "HTTP $delete_http_code"
            fi
        fi
    fi
else
    show_result "error" "Error en POST /personas" "HTTP $http_code"
    echo -e "${YELLOW}   Respuesta: $response_body${NC}"
fi

echo ""
echo -e "${BLUE}📋 Resumen de códigos HTTP esperados:${NC}"
echo -e "   GET /personas: 200"
echo -e "   POST /personas: 201 o 200"
echo -e "   GET /personas/{id}: 200"
echo -e "   PUT /personas/{id}: 200"
echo -e "   DELETE /personas/{id}: 204 o 200"
echo ""
echo -e "${YELLOW}🔧 Si hay errores, verifica:${NC}"
echo -e "   1. Que Laravel esté ejecutándose en http://localhost:8000"
echo -e "   2. Que el endpoint /api/personas esté configurado"
echo -e "   3. Que CORS esté habilitado en Laravel"
echo -e "   4. Que los campos en inglés estén configurados en Laravel"
