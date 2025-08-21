import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_CONFIG, getApiUrl } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class TestApiService {

  constructor(private http: HttpClient) { }

  // Probar el endpoint que ya funciona
  testConnection(): Observable<any> {
    return this.http.get(getApiUrl(API_CONFIG.ENDPOINTS.TEST));
  }

  // Probar el endpoint de personas
  testPersonas(): Observable<any> {
    return this.http.get(getApiUrl(API_CONFIG.ENDPOINTS.PERSONAS))
      .pipe(
        map((response: any) => response.data || response) // Maneja tanto {success:true,data:[]} como []
      );
  }

  // Crear una persona de prueba
  createTestPersona(): Observable<any> {
    const testData = {
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

    return this.http.post(getApiUrl(API_CONFIG.ENDPOINTS.PERSONAS), testData);
  }
}
