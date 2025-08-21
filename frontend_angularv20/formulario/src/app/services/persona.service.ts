import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_CONFIG, getApiUrl } from '../config/api.config';

export interface Persona {
  id?: number;
  first_name: string;
  last_name: string;
  birth_date: string;
  age: string;
  profession: string;
  address: string;
  phone: string;
  email: string;
  photo_url?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PersonaService {
  private apiUrl = getApiUrl(API_CONFIG.ENDPOINTS.PERSONAS);

  constructor(private http: HttpClient) { }

  // Obtener todas las personas
  getPersonas(): Observable<Persona[]> {
    return this.http.get<any>(this.apiUrl)
      .pipe(
        map(response => response.data || response) // Maneja tanto {success:true,data:[]} como []
      );
  }

  // Crear una nueva persona
  crearPersona(persona: Persona): Observable<Persona> {
    console.log('Enviando datos a la API:', persona);
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    
    return this.http.post<any>(this.apiUrl, persona, { headers })
      .pipe(
        map(response => {
          console.log('Respuesta de la API:', response);
          return response.data || response;
        })
      );
  }

  // Actualizar una persona existente
  actualizarPersona(id: number, persona: Persona): Observable<Persona> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, persona)
      .pipe(
        map(response => response.data || response) // Maneja tanto {success:true,data:{}} como {}
      );
  }

  // Eliminar una persona
  eliminarPersona(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Obtener una persona por ID
  getPersona(id: number): Observable<Persona> {
    return this.http.get<any>(`${this.apiUrl}/${id}`)
      .pipe(
        map(response => response.data || response) // Maneja tanto {success:true,data:{}} como {}
      );
  }
}
