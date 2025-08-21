import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PersonaService, Persona } from '../../services/persona.service';
import { EventService } from '../../services/event.service';
import { Chart, ChartConfiguration, ChartType } from 'chart.js';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  personas: Persona[] = [];
  
  @ViewChild('professionChart') professionChartRef!: ElementRef;
  @ViewChild('ageChart') ageChartRef!: ElementRef;
  @ViewChild('monthlyChart') monthlyChartRef!: ElementRef;

  private storageListener: any;
  private eventSubscription!: Subscription;

  constructor(
    private router: Router,
    private personaService: PersonaService,
    private eventService: EventService,
    private cdr: ChangeDetectorRef
  ) {
    console.log('HomeComponent constructor ejecutado');
  }

  ngOnInit() {
    console.log('HomeComponent ngOnInit ejecutado');
    this.cargarPersonas();
    this.setupStorageListener();
    this.setupEventSubscription();
  }

  ngOnDestroy() {
    if (this.storageListener) {
      window.removeEventListener('storage', this.storageListener);
    }
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
    }
  }

  setupEventSubscription() {
    this.eventSubscription = this.eventService.dataUpdated$.subscribe(() => {
      console.log('Evento de actualización recibido, recargando datos...');
      // Forzar la recarga inmediata de datos con un pequeño delay
      setTimeout(() => {
        this.cargarPersonas();
      }, 100);
    });
  }

  setupStorageListener() {
    // Escuchar cambios en localStorage
    this.storageListener = (event: StorageEvent) => {
      if (event.key === 'personas' || event.key === null) {
        console.log('Cambio detectado en localStorage, recargando datos...');
        this.recargarDatos();
      }
    };
    
    window.addEventListener('storage', this.storageListener);
    
    // También escuchar cambios locales (mismo tab)
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
      const event = new Event('localStorageChange');
      (event as any).key = key;
      (event as any).value = value;
      window.dispatchEvent(event);
      originalSetItem.apply(this, [key, value]);
    };
    
    window.addEventListener('localStorageChange', (event: any) => {
      if (event.key === 'personas') {
        console.log('Cambio local detectado en localStorage, recargando datos...');
        this.recargarDatos();
      }
    });
  }

  recargarDatos() {
    console.log('Recargando datos del dashboard...');
    this.cargarPersonas();
    // También actualizar los gráficos después de un breve delay
    setTimeout(() => {
      this.actualizarGraficos();
    }, 500);
  }



  ngAfterViewInit() {
    // Los gráficos se crearán después de cargar los datos
  }

  cargarPersonas() {
    console.log('Iniciando carga de personas...');
    this.personaService.getPersonas().subscribe({
      next: (personas) => {
        this.personas = personas || [];
        console.log('Personas cargadas desde API:', this.personas.length, 'personas');
        console.log('Últimas 3 personas:', this.personas.slice(-3));
        this.crearGraficos();
        this.cdr.detectChanges(); // Forzar detección de cambios
      },
      error: (error) => {
        console.error('Error al cargar personas desde API:', error);
        // Fallback: cargar desde localStorage si la API falla
        const datosGuardados = localStorage.getItem('personas');
        if (datosGuardados) {
          this.personas = JSON.parse(datosGuardados);
          console.log('Personas cargadas desde localStorage:', this.personas.length, 'personas');
        } else {
          this.personas = [];
          console.log('No hay datos en localStorage, array vacío');
        }
        this.crearGraficos();
        this.cdr.detectChanges(); // Forzar detección de cambios
      }
    });
  }

  crearGraficos() {
    setTimeout(() => {
      this.crearGraficoProfesiones();
      this.crearGraficoEdades();
      this.crearGraficoMensual();
    }, 100);
  }

  actualizarGraficos() {
    // Destruir gráficos existentes si existen
    if (this.professionChartRef?.nativeElement) {
      const chartInstance = Chart.getChart(this.professionChartRef.nativeElement);
      if (chartInstance) {
        chartInstance.destroy();
      }
    }
    if (this.ageChartRef?.nativeElement) {
      const chartInstance = Chart.getChart(this.ageChartRef.nativeElement);
      if (chartInstance) {
        chartInstance.destroy();
      }
    }
    if (this.monthlyChartRef?.nativeElement) {
      const chartInstance = Chart.getChart(this.monthlyChartRef.nativeElement);
      if (chartInstance) {
        chartInstance.destroy();
      }
    }
    
    // Crear nuevos gráficos
    this.crearGraficos();
  }

  crearGraficoProfesiones() {
    if (!this.professionChartRef?.nativeElement) return;

    const profesiones = this.obtenerDatosProfesiones();
    
    const ctx = this.professionChartRef.nativeElement.getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: profesiones.labels,
        datasets: [{
          label: 'Número de Personas',
          data: profesiones.data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(255, 159, 64, 0.8)',
            'rgba(199, 199, 199, 0.8)',
            'rgba(83, 102, 255, 0.8)',
            'rgba(78, 252, 3, 0.8)',
            'rgba(252, 3, 244, 0.8)',
            'rgba(3, 252, 198, 0.8)',
            'rgba(252, 186, 3, 0.8)',
            'rgba(252, 3, 61, 0.8)',
            'rgba(3, 169, 252, 0.8)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(199, 199, 199, 1)',
            'rgba(83, 102, 255, 1)',
            'rgba(78, 252, 3, 1)',
            'rgba(252, 3, 244, 1)',
            'rgba(3, 252, 198, 1)',
            'rgba(252, 186, 3, 1)',
            'rgba(252, 3, 61, 1)',
            'rgba(3, 169, 252, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Personas por Profesión',
            font: {
              size: 16,
              weight: 'bold'
            }
          },
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    });
  }

  crearGraficoEdades() {
    if (!this.ageChartRef?.nativeElement) return;

    const edades = this.obtenerDatosEdades();
    
    const ctx = this.ageChartRef.nativeElement.getContext('2d');
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: edades.labels,
        datasets: [{
          data: edades.data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)'
          ],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Distribución por Edad',
            font: {
              size: 16,
              weight: 'bold'
            }
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }

  crearGraficoMensual() {
    if (!this.monthlyChartRef?.nativeElement) return;

    const mensual = this.obtenerDatosMensuales();
    
    const ctx = this.monthlyChartRef.nativeElement.getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: mensual.labels,
        datasets: [{
          label: 'Personas Registradas',
          data: mensual.data,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: 'rgba(75, 192, 192, 1)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Registros por Mes',
            font: {
              size: 16,
              weight: 'bold'
            }
          },
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    });
  }

  obtenerDatosProfesiones() {
    const profesiones: { [key: string]: number } = {};
    
    // Mapeo de profesiones en inglés a español
    const traduccionProfesiones: { [key: string]: string } = {
      'Engineer': 'Ingeniero',
      'Doctor': 'Médico',
      'Lawyer': 'Abogado',
      'Teacher': 'Profesor',
      'Accountant': 'Contador',
      'Architect': 'Arquitecto',
      'Nurse': 'Enfermero',
      'Designer': 'Diseñador',
      'Programmer': 'Programador',
      'Administrator': 'Administrador',
      'Salesperson': 'Vendedor',
      'Student': 'Estudiante',
      'Other': 'Otro'
    };
    
    this.personas.forEach(persona => {
      const profesionIngles = persona.profession || 'Sin especificar';
      const profesionEspanol = traduccionProfesiones[profesionIngles] || profesionIngles;
      profesiones[profesionEspanol] = (profesiones[profesionEspanol] || 0) + 1;
    });

    return {
      labels: Object.keys(profesiones),
      data: Object.values(profesiones)
    };
  }

  obtenerDatosEdades() {
    const rangos = {
      '0-18': 0,
      '19-35': 0,
      '36-60': 0,
      '60+': 0
    };

    this.personas.forEach(persona => {
      const edad = parseInt(persona.age) || 0;
      if (edad <= 18) rangos['0-18']++;
      else if (edad <= 35) rangos['19-35']++;
      else if (edad <= 60) rangos['36-60']++;
      else rangos['60+']++;
    });

    return {
      labels: Object.keys(rangos),
      data: Object.values(rangos)
    };
  }

  obtenerDatosMensuales() {
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    
    const datosMensuales = new Array(12).fill(0);
    
    this.personas.forEach(persona => {
      if (persona.birth_date) {
        // Usar la fecha de nacimiento para determinar el mes
        const fecha = new Date(persona.birth_date);
        const mes = fecha.getMonth();
        datosMensuales[mes]++;
      } else if (persona.id) {
        // Fallback: simular distribución por mes basada en el ID
        const mes = (persona.id % 12);
        datosMensuales[mes]++;
      }
    });

    return {
      labels: meses,
      data: datosMensuales
    };
  }

  nuevoRegistro() {
    console.log('Navegando a registro');
    this.router.navigate(['/registro']);
  }

  verReportes() {
    console.log('Ver reportes - funcionalidad pendiente');
    alert('Función de reportes en desarrollo');
  }

           configuracion() {
           console.log('Configuración - funcionalidad pendiente');
           alert('Función de configuración en desarrollo');
         }

         irAPruebas() {
           console.log('Navegando a pruebas de API');
           this.router.navigate(['/api-test']);
         }


}
