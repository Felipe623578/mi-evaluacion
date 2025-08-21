<?php

/**
 * Script para probar la API REST de Laravel
 * Ejecutar desde la línea de comandos: php test-laravel-api.php
 */

// Configuración
$API_BASE_URL = 'http://localhost:8000/api';
$PERSONAS_ENDPOINT = $API_BASE_URL . '/personas';

// Colores para la consola
$colors = [
    'green' => "\033[32m",
    'red' => "\033[31m",
    'yellow' => "\033[33m",
    'blue' => "\033[34m",
    'reset' => "\033[0m",
    'bold' => "\033[1m"
];

// Función para mostrar resultados
function showResult($success, $message, $data = null) {
    global $colors;
    $icon = $success ? '✅' : '❌';
    $color = $success ? $colors['green'] : $colors['red'];
    echo $color . $icon . ' ' . $message . $colors['reset'] . "\n";
    if ($data) {
        echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n";
    }
    echo "\n";
}

// Función para mostrar información
function showInfo($message) {
    global $colors;
    echo $colors['blue'] . "ℹ️  " . $message . $colors['reset'] . "\n";
}

// Función para mostrar advertencia
function showWarning($message) {
    global $colors;
    echo $colors['yellow'] . "⚠️  " . $message . $colors['reset'] . "\n";
}

// Función para hacer peticiones HTTP
function makeRequest($url, $method = 'GET', $data = null) {
    $ch = curl_init();
    
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Accept: application/json'
    ]);
    
    if ($method === 'POST') {
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    } elseif ($method === 'PUT') {
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    } elseif ($method === 'DELETE') {
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE');
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    if ($error) {
        throw new Exception("Error de cURL: " . $error);
    }
    
    return [
        'status' => $httpCode,
        'body' => $response
    ];
}

// Función principal de pruebas
function runTests() {
    global $colors, $PERSONAS_ENDPOINT;
    
    echo $colors['bold'] . "🧪 Iniciando pruebas de API REST de Laravel..." . $colors['reset'] . "\n";
    echo "==============================================\n\n";
    
    $createdPersonId = null;
    
    try {
        // 1. Probar GET - Obtener todas las personas
        showInfo('1. Probando GET /api/personas...');
        $getResponse = makeRequest($PERSONAS_ENDPOINT);
        
        if ($getResponse['status'] === 200) {
            $personas = json_decode($getResponse['body'], true);
            showResult(true, "GET /api/personas - Éxito (HTTP {$getResponse['status']})", $personas);
        } else {
            showResult(false, "GET /api/personas - Error (HTTP {$getResponse['status']})");
            echo "Respuesta: " . $getResponse['body'] . "\n\n";
        }
        
        // 2. Probar POST - Crear una nueva persona
        showInfo('2. Probando POST /api/personas...');
        $testData = [
            'nombres' => 'Test',
            'apellidos' => 'Usuario',
            'fechaNacimiento' => '1990-01-01',
            'edad' => '33',
            'profesion' => 'Desarrollador',
            'direccion' => 'Calle Test #123',
            'telefono' => '3001234567',
            'foto' => ''
        ];
        
        $postResponse = makeRequest($PERSONAS_ENDPOINT, 'POST', $testData);
        
        if ($postResponse['status'] === 201 || $postResponse['status'] === 200) {
            $persona = json_decode($postResponse['body'], true);
            showResult(true, "POST /api/personas - Éxito (HTTP {$postResponse['status']})", $persona);
            $createdPersonId = $persona['id'] ?? null;
            echo "ID de persona creada: " . ($createdPersonId ?? 'No disponible') . "\n\n";
        } else {
            showResult(false, "POST /api/personas - Error (HTTP {$postResponse['status']})");
            echo "Respuesta: " . $postResponse['body'] . "\n\n";
        }
        
        // 3. Probar GET - Obtener una persona específica
        if ($createdPersonId) {
            showInfo("3. Probando GET /api/personas/{$createdPersonId}...");
            $getOneResponse = makeRequest($PERSONAS_ENDPOINT . '/' . $createdPersonId);
            
            if ($getOneResponse['status'] === 200) {
                $persona = json_decode($getOneResponse['body'], true);
                showResult(true, "GET /api/personas/{$createdPersonId} - Éxito (HTTP {$getOneResponse['status']})", $persona);
            } else {
                showResult(false, "GET /api/personas/{$createdPersonId} - Error (HTTP {$getOneResponse['status']})");
                echo "Respuesta: " . $getOneResponse['body'] . "\n\n";
            }
            
            // 4. Probar PUT - Actualizar la persona
            showInfo("4. Probando PUT /api/personas/{$createdPersonId}...");
            $updateData = [
                'nombres' => 'Test Actualizado',
                'apellidos' => 'Usuario Modificado',
                'fechaNacimiento' => '1990-01-01',
                'edad' => '34',
                'profesion' => 'Desarrollador Senior',
                'direccion' => 'Calle Test Actualizada #456',
                'telefono' => '3001234567',
                'foto' => ''
            ];
            
            $putResponse = makeRequest($PERSONAS_ENDPOINT . '/' . $createdPersonId, 'PUT', $updateData);
            
            if ($putResponse['status'] === 200) {
                $persona = json_decode($putResponse['body'], true);
                showResult(true, "PUT /api/personas/{$createdPersonId} - Éxito (HTTP {$putResponse['status']})", $persona);
            } else {
                showResult(false, "PUT /api/personas/{$createdPersonId} - Error (HTTP {$putResponse['status']})");
                echo "Respuesta: " . $putResponse['body'] . "\n\n";
            }
            
            // 5. Probar DELETE - Eliminar la persona
            showInfo("5. Probando DELETE /api/personas/{$createdPersonId}...");
            $deleteResponse = makeRequest($PERSONAS_ENDPOINT . '/' . $createdPersonId, 'DELETE');
            
            if ($deleteResponse['status'] === 204 || $deleteResponse['status'] === 200) {
                showResult(true, "DELETE /api/personas/{$createdPersonId} - Éxito (HTTP {$deleteResponse['status']})");
            } else {
                showResult(false, "DELETE /api/personas/{$createdPersonId} - Error (HTTP {$deleteResponse['status']})");
                echo "Respuesta: " . $deleteResponse['body'] . "\n\n";
            }
        } else {
            showWarning("No se pudo obtener ID de persona para pruebas de GET, PUT y DELETE");
        }
        
        // 6. Probar GET final para verificar estado
        showInfo('6. Verificando estado final con GET /api/personas...');
        $finalGetResponse = makeRequest($PERSONAS_ENDPOINT);
        
        if ($finalGetResponse['status'] === 200) {
            $personas = json_decode($finalGetResponse['body'], true);
            showResult(true, "GET final /api/personas - Éxito (HTTP {$finalGetResponse['status']})", $personas);
        } else {
            showResult(false, "GET final /api/personas - Error (HTTP {$finalGetResponse['status']})");
            echo "Respuesta: " . $finalGetResponse['body'] . "\n\n";
        }
        
    } catch (Exception $e) {
        showResult(false, "Error: " . $e->getMessage());
        showWarning("Verifica que Laravel esté ejecutándose en http://localhost:8000");
    }
    
    echo $colors['bold'] . "🏁 Pruebas completadas!" . $colors['reset'] . "\n";
    echo "======================\n\n";
    
    echo "📋 Resumen de códigos HTTP esperados:\n";
    echo "   GET /personas: 200\n";
    echo "   POST /personas: 201\n";
    echo "   GET /personas/{id}: 200\n";
    echo "   PUT /personas/{id}: 200\n";
    echo "   DELETE /personas/{id}: 204\n\n";
    
    echo "💡 Si ves errores, verifica:\n";
    echo "   - Laravel esté ejecutándose en http://localhost:8000\n";
    echo "   - Las rutas estén configuradas en routes/api.php\n";
    echo "   - CORS esté configurado correctamente\n";
    echo "   - La base de datos esté conectada\n";
}

// Ejecutar pruebas
runTests();
