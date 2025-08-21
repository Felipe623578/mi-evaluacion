import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PersonaService, Persona } from '../../services/persona.service';
import { EventService } from '../../services/event.service';

@Component({
    selector: 'app-registro-persona',
     standalone: true,
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './registro-persona.component.html',
    styleUrls: ['./registro-persona.component.css']
})
export class RegistroComponent implements OnInit {
    personas: Persona[] = [];
    mostrarModal = false;
    editandoPersona: Persona | null = null;
    formularioModal: FormGroup;

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private personaService: PersonaService,
        private eventService: EventService
    ) {
        console.log('RegistroComponent constructor ejecutado');
        this.formularioModal = this.crearFormularioModal();
    }

    ngOnInit() {
        this.cargarPersonas();
        this.setupModalListeners();
    }

    cargarPersonas() {
        this.personaService.getPersonas().subscribe({
            next: (personas) => {
                this.personas = personas;
                console.log('Personas cargadas desde API:', personas);
            },
            error: (error) => {
                console.error('Error al cargar personas:', error);
                this.mostrarNotificacion('Error al cargar los registros desde el servidor', 'error');
                // Fallback: cargar desde localStorage si la API falla
                const datosGuardados = localStorage.getItem('personas');
                if (datosGuardados) {
                    this.personas = JSON.parse(datosGuardados);
                }
            }
        });
    }

    crearFormularioModal(): FormGroup {
        return this.fb.group({
            first_name: ['', [Validators.required, Validators.minLength(2)]],
            last_name: ['', [Validators.required, Validators.minLength(2)]],
            birth_date: ['', Validators.required],
            age: ['', Validators.required],
            profession: ['', Validators.required],
            address: ['', [Validators.required, Validators.minLength(10)]],
            phone: ['', [
                Validators.required, 
                Validators.pattern(/^\d+$/), 
                Validators.minLength(7), 
                Validators.maxLength(10)
            ]],
            email: ['', [Validators.required, Validators.email]],
            photo_url: ['']
        });
    }

    setupModalListeners() {
        // Listener para fecha de nacimiento
        this.formularioModal.get('birth_date')?.valueChanges.subscribe(fecha => {
            if (fecha) {
                const edad = this.calcularEdad(fecha);
                this.formularioModal.patchValue({ age: edad.toString() });
            }
        });
    }

    calcularEdad(fechaNacimiento: string): number {
        const hoy = new Date();
        const fechaNac = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - fechaNac.getFullYear();
        const mes = hoy.getMonth() - fechaNac.getMonth();
        
        if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
            edad--;
        }
        
        return edad;
    }

    getMaxDate(): string {
        const hoy = new Date();
        return hoy.toISOString().split('T')[0];
    }

    abrirModal() {
        this.editandoPersona = null;
        this.formularioModal.reset();
        this.mostrarModal = true;
    }

    cerrarModal() {
        this.mostrarModal = false;
        this.editandoPersona = null;
        this.formularioModal.reset();
    }

    editarPersona(persona: Persona) {
        this.editandoPersona = persona;
        this.formularioModal.patchValue({
            first_name: persona.first_name,
            last_name: persona.last_name,
            birth_date: persona.birth_date,
            age: persona.age,
            profession: persona.profession,
            address: persona.address,
            phone: persona.phone,
            email: persona.email,
            photo_url: persona.photo_url || ''
        });
        this.mostrarModal = true;
    }

    onFileChangeModal(event: any) {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB
                alert('El archivo es demasiado grande. Máximo 5MB.');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.formularioModal.patchValue({ foto: e.target.result });
            };
            reader.readAsDataURL(file);
        }
    }

    removeFileModal() {
        this.formularioModal.patchValue({ foto: '' });
    }

    guardarRegistro() {
        if (this.formularioModal.valid) {
            const formValue = this.formularioModal.value;
            
            if (this.editandoPersona) {
                // Actualizar persona existente
                const personaActualizada: Persona = {
                    ...this.editandoPersona,
                    first_name: formValue.first_name,
                    last_name: formValue.last_name,
                    birth_date: formValue.birth_date,
                    age: formValue.age,
                    profession: formValue.profession,
                    address: formValue.address,
                    phone: formValue.phone,
                    email: formValue.email,
                    photo_url: formValue.photo_url || undefined
                };

                this.personaService.actualizarPersona(this.editandoPersona.id!, personaActualizada).subscribe({
                    next: (persona) => {
                        // Actualizar en el array local
                        const index = this.personas.findIndex(p => p.id === this.editandoPersona!.id);
                        if (index !== -1) {
                            this.personas[index] = persona;
                        }
                        this.mostrarNotificacion('Registro actualizado exitosamente', 'success');
                        this.cerrarModal();
                        // Notificar que los datos se actualizaron
                        this.eventService.notifyDataUpdated();
                    },
                    error: (error) => {
                        console.error('Error al actualizar persona:', error);
                        this.mostrarNotificacion('Error al actualizar el registro en el servidor', 'error');
                    }
                });
            } else {
                // Crear nueva persona
                const nuevaPersona: Persona = {
                    first_name: formValue.first_name,
                    last_name: formValue.last_name,
                    birth_date: formValue.birth_date,
                    age: formValue.age,
                    profession: formValue.profession,
                    address: formValue.address,
                    phone: formValue.phone,
                    email: formValue.email,
                    photo_url: formValue.photo_url || undefined
                };

                this.personaService.crearPersona(nuevaPersona).subscribe({
                    next: (persona) => {
                        this.personas.push(persona);
                        this.mostrarNotificacion('Registro guardado exitosamente', 'success');
                        this.cerrarModal();
                        // Notificar que los datos se actualizaron
                        this.eventService.notifyDataUpdated();
                    },
                                            error: (error) => {
                            console.error('Error al crear persona:', error);
                            console.error('Datos enviados:', formValue);
                            let mensajeError = 'Error al guardar el registro en el servidor';
                            
                            if (error.status === 422) {
                                // Error de validación
                                if (error.error && error.error.errors) {
                                    const validationErrors = error.error.errors;
                                    const errorMessages = Object.keys(validationErrors)
                                        .map(field => `${field}: ${validationErrors[field].join(', ')}`)
                                        .join('\n');
                                    mensajeError = `Error de validación:\n${errorMessages}`;
                                } else if (error.error && error.error.message) {
                                    mensajeError = `Error de validación: ${error.error.message}`;
                                }
                            } else if (error.message) {
                                mensajeError = error.message;
                            } else if (error.error && error.error.message) {
                                mensajeError = error.error.message;
                            }
                            
                            this.mostrarNotificacion(mensajeError, 'error');
                        }
                });
            }
        } else {
            this.mostrarNotificacion('Por favor, completa todos los campos requeridos correctamente', 'error');
        }
    }

    mostrarNotificacion(mensaje: string, tipo: 'success' | 'error' | 'warning' = 'success') {
        // Crear elemento de notificación
        const notificacion = document.createElement('div');
        notificacion.className = `notificacion notificacion-${tipo}`;
        
        // Determinar icono según el tipo
        let icono = '';
        switch (tipo) {
            case 'success':
                icono = '✅';
                break;
            case 'error':
                icono = '❌';
                break;
            case 'warning':
                icono = '⚠️';
                break;
        }
        
        notificacion.innerHTML = `
            <div class="notificacion-contenido">
                <span class="notificacion-icono">${icono}</span>
                <span class="notificacion-mensaje">${mensaje}</span>
                <button class="notificacion-cerrar" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        // Agregar al body
        document.body.appendChild(notificacion);
        
        // Auto-remover después de 5 segundos
        setTimeout(() => {
            if (notificacion.parentElement) {
                notificacion.remove();
            }
        }, 5000);
    }

    eliminarPersona(id?: number) {
        if (id && confirm('¿Estás seguro de que quieres eliminar este registro?')) {
            this.personaService.eliminarPersona(id).subscribe({
                next: () => {
                    this.personas = this.personas.filter(p => p.id !== id);
                    this.mostrarNotificacion('Registro eliminado exitosamente', 'success');
                    // Notificar que los datos se actualizaron
                    this.eventService.notifyDataUpdated();
                },
                error: (error) => {
                    console.error('Error al eliminar persona:', error);
                    this.mostrarNotificacion('Error al eliminar el registro del servidor', 'error');
                }
            });
        }
    }

    volver() {
        console.log('Volviendo al dashboard');
        this.router.navigate(['/']);
    }

    trackByPersona(index: number, item: any): number {
        return item.id || index;
    }

    traducirProfesion(profesionIngles: string): string {
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
        
        return traduccionProfesiones[profesionIngles] || profesionIngles;
    }
}
