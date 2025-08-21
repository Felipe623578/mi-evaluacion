import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonaService, Persona } from '../../services/persona.service';
import { TestApiService } from '../../services/test-api.service';

@Component({
  selector: 'app-api-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="api-test-container">
      <h2>🧪 Pruebas de API REST</h2>
      
      <!-- Estado de conexión -->
      <div class="connection-status">
        <h3>Estado de Conexión</h3>
        <div class="status-indicator" [class]="connectionStatus">
          {{ connectionStatus === 'connected' ? '✅ Conectado' : 
             connectionStatus === 'error' ? '❌ Error de Conexión' : '⏳ Probando...' }}
        </div>
      </div>

      <!-- Botones de prueba -->
      <div class="test-buttons">
        <button (click)="testGetPersonas()" [disabled]="loading" class="test-btn">
          {{ loading ? '⏳ Probando...' : '📋 Obtener Personas' }}
        </button>
        
        <button (click)="testLaravelConnection()" [disabled]="loading" class="test-btn">
          {{ loading ? '⏳ Probando...' : '🔗 Probar Laravel' }}
        </button>
        
        <button (click)="testCreatePersona()" [disabled]="loading" class="test-btn">
          {{ loading ? '⏳ Probando...' : '➕ Crear Persona' }}
        </button>
        
        <button (click)="testUpdatePersona()" [disabled]="loading || !lastCreatedId" class="test-btn">
          {{ loading ? '⏳ Probando...' : '✏️ Actualizar Persona' }}
        </button>
        
        <button (click)="testDeletePersona()" [disabled]="loading || !lastCreatedId" class="test-btn delete">
          {{ loading ? '⏳ Probando...' : '🗑️ Eliminar Persona' }}
        </button>
      </div>

      <!-- Resultados -->
      <div class="test-results" *ngIf="testResults.length > 0">
        <h3>Resultados de Pruebas</h3>
        <div class="result-item" *ngFor="let result of testResults; let i = index">
          <div class="result-header">
            <span class="result-type">{{ result.type }}</span>
            <span class="result-status" [class]="result.success ? 'success' : 'error'">
              {{ result.success ? '✅ Éxito' : '❌ Error' }}
            </span>
          </div>
          <div class="result-message">{{ result.message }}</div>
          <div class="result-data" *ngIf="result.data">
            <pre>{{ result.data | json }}</pre>
          </div>
        </div>
      </div>

      <!-- Datos actuales -->
      <div class="current-data" *ngIf="personas.length > 0">
        <h3>Datos Actuales en la API</h3>
                 <div class="persona-item" *ngFor="let persona of personas">
           <strong>{{ persona.first_name }} {{ persona.last_name }}</strong>
                      <span>ID: {{ persona.id }}</span>
            <span>Age: {{ persona.age }}</span>
            <span>Profession: {{ persona.profession }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .api-test-container {
      max-width: 800px;
      margin: 2rem auto;
      padding: 2rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    h2 {
      color: #1f2937;
      margin-bottom: 2rem;
      text-align: center;
    }

    .connection-status {
      margin-bottom: 2rem;
      padding: 1rem;
      background: #f8fafc;
      border-radius: 8px;
    }

    .status-indicator {
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-weight: 600;
      text-align: center;
    }

    .status-indicator.connected {
      background: #dcfce7;
      color: #166534;
    }

    .status-indicator.error {
      background: #fee2e2;
      color: #dc2626;
    }

    .status-indicator.loading {
      background: #fef3c7;
      color: #d97706;
    }

    .test-buttons {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .test-btn {
      padding: 1rem;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      background: #3b82f6;
      color: white;
    }

    .test-btn:hover:not(:disabled) {
      background: #2563eb;
      transform: translateY(-2px);
    }

    .test-btn:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }

    .test-btn.delete {
      background: #ef4444;
    }

    .test-btn.delete:hover:not(:disabled) {
      background: #dc2626;
    }

    .test-results {
      margin-bottom: 2rem;
    }

    .result-item {
      margin-bottom: 1rem;
      padding: 1rem;
      border-radius: 8px;
      border-left: 4px solid #e5e7eb;
    }

    .result-item .result-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .result-type {
      font-weight: 600;
      color: #374151;
    }

    .result-status.success {
      color: #059669;
    }

    .result-status.error {
      color: #dc2626;
    }

    .result-message {
      color: #6b7280;
      margin-bottom: 0.5rem;
    }

    .result-data {
      background: #f9fafb;
      padding: 1rem;
      border-radius: 6px;
      font-size: 0.875rem;
      overflow-x: auto;
    }

    .current-data {
      margin-top: 2rem;
    }

    .persona-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      margin-bottom: 0.5rem;
      background: #f8fafc;
      border-radius: 6px;
      border-left: 4px solid #3b82f6;
    }

    .persona-item span {
      color: #6b7280;
      font-size: 0.875rem;
    }
  `]
})
export class ApiTestComponent implements OnInit {
  connectionStatus: 'loading' | 'connected' | 'error' = 'loading';
  loading = false;
  testResults: any[] = [];
  personas: Persona[] = [];
  lastCreatedId?: number;

  constructor(
    private personaService: PersonaService,
    private testApiService: TestApiService
  ) {}

  ngOnInit() {
    this.testConnection();
  }

  testConnection() {
    this.loading = true;
    // Primero probar el endpoint que sabemos que funciona
    this.testApiService.testConnection().subscribe({
      next: (response) => {
        this.connectionStatus = 'connected';
        this.addTestResult('GET /test', true, 'Conexión exitosa con Laravel', response);
        
        // Luego probar el endpoint de personas
        this.testApiService.testPersonas().subscribe({
          next: (personas) => {
            this.personas = personas;
            this.addTestResult('GET /personas', true, 'Endpoint personas funcionando', personas);
            this.loading = false;
          },
          error: (error) => {
            this.addTestResult('GET /personas', false, `Endpoint personas no disponible: ${error.message}`, null);
            this.loading = false;
          }
        });
      },
      error: (error) => {
        this.connectionStatus = 'error';
        this.addTestResult('GET /test', false, `Error de conexión: ${error.message}`, null);
        this.loading = false;
      }
    });
  }

  testGetPersonas() {
    this.loading = true;
    this.personaService.getPersonas().subscribe({
      next: (personas) => {
        this.personas = personas;
        this.addTestResult('GET /personas', true, `Se obtuvieron ${personas.length} personas`, personas);
        this.loading = false;
      },
      error: (error) => {
        this.addTestResult('GET /personas', false, `Error: ${error.message}`, null);
        this.loading = false;
      }
    });
  }

  testLaravelConnection() {
    this.loading = true;
    this.testApiService.testConnection().subscribe({
      next: (response) => {
        this.addTestResult('GET /test', true, 'Conexión exitosa con Laravel', response);
        this.loading = false;
      },
      error: (error) => {
        this.addTestResult('GET /test', false, `Error: ${error.message}`, null);
        this.loading = false;
      }
    });
  }

  testCreatePersona() {
    this.loading = true;
    const nuevaPersona: Persona = {
      first_name: 'Test',
      last_name: 'User',
      birth_date: '1990-01-01',
      age: '33',
      profession: 'Developer',
      address: 'Test Street #123',
      phone: '3001234567',
      email: 'test@example.com',
      photo_url: ''
    };

    this.personaService.crearPersona(nuevaPersona).subscribe({
      next: (persona) => {
        this.lastCreatedId = persona.id;
        this.personas.push(persona);
        this.addTestResult('POST /personas', true, 'Persona creada exitosamente', persona);
        this.loading = false;
      },
      error: (error) => {
        this.addTestResult('POST /personas', false, `Error: ${error.message}`, null);
        this.loading = false;
      }
    });
  }

  testUpdatePersona() {
    if (!this.lastCreatedId) return;

    this.loading = true;
    const personaActualizada: Persona = {
      first_name: 'Test Updated',
      last_name: 'User Modified',
      birth_date: '1990-01-01',
      age: '34',
      profession: 'Senior Developer',
      address: 'Updated Test Street #456',
      phone: '3001234567',
      email: 'updated@example.com',
      photo_url: ''
    };

    this.personaService.actualizarPersona(this.lastCreatedId, personaActualizada).subscribe({
      next: (persona) => {
        const index = this.personas.findIndex(p => p.id === this.lastCreatedId);
        if (index !== -1) {
          this.personas[index] = persona;
        }
        this.addTestResult('PUT /personas', true, 'Persona actualizada exitosamente', persona);
        this.loading = false;
      },
      error: (error) => {
        this.addTestResult('PUT /personas', false, `Error: ${error.message}`, null);
        this.loading = false;
      }
    });
  }

  testDeletePersona() {
    if (!this.lastCreatedId) return;

    this.loading = true;
    this.personaService.eliminarPersona(this.lastCreatedId).subscribe({
      next: () => {
        this.personas = this.personas.filter(p => p.id !== this.lastCreatedId);
        this.addTestResult('DELETE /personas', true, 'Persona eliminada exitosamente', null);
        this.lastCreatedId = undefined;
        this.loading = false;
      },
      error: (error) => {
        this.addTestResult('DELETE /personas', false, `Error: ${error.message}`, null);
        this.loading = false;
      }
    });
  }

  private addTestResult(type: string, success: boolean, message: string, data: any) {
    this.testResults.unshift({
      type,
      success,
      message,
      data,
      timestamp: new Date().toLocaleTimeString()
    });

    // Mantener solo los últimos 10 resultados
    if (this.testResults.length > 10) {
      this.testResults = this.testResults.slice(0, 10);
    }
  }
}
