export const API_CONFIG = {
  // URL base de tu API Laravel
  BASE_URL: 'http://localhost:8000/api', // Cambia el puerto si es necesario
  
  // Endpoints específicos
  ENDPOINTS: {
    PERSONAS: '/persons', // Cambiar a persons para coincidir con Laravel
    PERSONS: '/persons',  // Alias para mantener compatibilidad
    TEST: '/test',
    // Puedes agregar más endpoints aquí
    // USUARIOS: '/usuarios',
    // PRODUCTOS: '/productos',
  }
};

// Función helper para construir URLs completas
export function getApiUrl(endpoint: string): string {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}
