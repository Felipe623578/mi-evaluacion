const axios = require('axios');

// Configuración
const API_BASE_URL = 'http://localhost:8000/api';
const PERSONAS_ENDPOINT = `${API_BASE_URL}/personas`;

// Colores para la consola
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m',
    bold: '\x1b[1m'
};

// Función para mostrar resultados
function showResult(success, message, data = null) {
    const icon = success ? '✅' : '❌';
    const color = success ? colors.green : colors.red;
    console.log(`${color}${icon} ${message}${colors.reset}`);
    if (data) {
        console.log(JSON.stringify(data, null, 2));
    }
    console.log('');
}

// Función para mostrar información
function showInfo(message) {
    console.log(`${colors.blue}ℹ️  ${message}${colors.reset}`);
}

// Función para mostrar advertencia
function showWarning(message) {
    console.log(`${colors.yellow}⚠️  ${message}${colors.reset}`);
}

// Función principal de pruebas
async function runTests() {
    console.log(`${colors.bold}🧪 Iniciando pruebas de API REST...${colors.reset}`);
    console.log('==================================\n');

    let createdPersonId = null;

    try {
        // 1. Probar GET - Obtener todas las personas
        showInfo('1. Probando GET /api/personas...');
        const getResponse = await axios.get(PERSONAS_ENDPOINT);
        showResult(true, `GET /api/personas - Éxito (HTTP ${getResponse.status})`, getResponse.data);

        // 2. Probar POST - Crear una nueva persona
        showInfo('2. Probando POST /api/personas...');
        const testData = {
            nombres: 'Test',
            apellidos: 'Usuario',
            fechaNacimiento: '1990-01-01',
            edad: '33',
            profesion: 'Desarrollador',
            direccion: 'Calle Test #123',
            telefono: '3001234567',
            foto: ''
        };

        const postResponse = await axios.post(PERSONAS_ENDPOINT, testData);
        showResult(true, `POST /api/personas - Éxito (HTTP ${postResponse.status})`, postResponse.data);
        
        createdPersonId = postResponse.data.id;
        console.log(`ID de persona creada: ${createdPersonId}\n`);

        // 3. Probar GET - Obtener una persona específica
        if (createdPersonId) {
            showInfo(`3. Probando GET /api/personas/${createdPersonId}...`);
            const getOneResponse = await axios.get(`${PERSONAS_ENDPOINT}/${createdPersonId}`);
            showResult(true, `GET /api/personas/${createdPersonId} - Éxito (HTTP ${getOneResponse.status})`, getOneResponse.data);

            // 4. Probar PUT - Actualizar la persona
            showInfo(`4. Probando PUT /api/personas/${createdPersonId}...`);
            const updateData = {
                nombres: 'Test Actualizado',
                apellidos: 'Usuario Modificado',
                fechaNacimiento: '1990-01-01',
                edad: '34',
                profesion: 'Desarrollador Senior',
                direccion: 'Calle Test Actualizada #456',
                telefono: '3001234567',
                foto: ''
            };

            const putResponse = await axios.put(`${PERSONAS_ENDPOINT}/${createdPersonId}`, updateData);
            showResult(true, `PUT /api/personas/${createdPersonId} - Éxito (HTTP ${putResponse.status})`, putResponse.data);

            // 5. Probar DELETE - Eliminar la persona
            showInfo(`5. Probando DELETE /api/personas/${createdPersonId}...`);
            const deleteResponse = await axios.delete(`${PERSONAS_ENDPOINT}/${createdPersonId}`);
            showResult(true, `DELETE /api/personas/${createdPersonId} - Éxito (HTTP ${deleteResponse.status})`);
        }

        // 6. Probar GET final para verificar estado
        showInfo('6. Verificando estado final con GET /api/personas...');
        const finalGetResponse = await axios.get(PERSONAS_ENDPOINT);
        showResult(true, `GET final /api/personas - Éxito (HTTP ${finalGetResponse.status})`, finalGetResponse.data);

    } catch (error) {
        if (error.response) {
            // Error de respuesta del servidor
            showResult(false, `${error.config.method?.toUpperCase()} ${error.config.url} - Error (HTTP ${error.response.status})`);
            console.log('Respuesta del servidor:', error.response.data);
        } else if (error.request) {
            // Error de conexión
            showResult(false, 'Error de conexión - No se pudo conectar con el servidor');
            showWarning('Verifica que Laravel esté ejecutándose en http://localhost:8000');
        } else {
            // Otro error
            showResult(false, `Error: ${error.message}`);
        }
    }

    console.log(`${colors.bold}🏁 Pruebas completadas!${colors.reset}`);
    console.log('======================\n');
    
    console.log('📋 Resumen de códigos HTTP esperados:');
    console.log('   GET /personas: 200');
    console.log('   POST /personas: 201');
    console.log('   GET /personas/{id}: 200');
    console.log('   PUT /personas/{id}: 200');
    console.log('   DELETE /personas/{id}: 204\n');
    
    console.log('💡 Si ves errores, verifica:');
    console.log('   - Laravel esté ejecutándose en http://localhost:8000');
    console.log('   - Las rutas estén configuradas en routes/api.php');
    console.log('   - CORS esté configurado correctamente');
    console.log('   - La base de datos esté conectada');
}

// Ejecutar pruebas
runTests().catch(console.error);
