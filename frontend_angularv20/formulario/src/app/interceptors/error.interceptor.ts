import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Ha ocurrido un error inesperado';
        
        if (error.error instanceof ErrorEvent) {
          // Error del lado del cliente
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Error del lado del servidor
          switch (error.status) {
            case 400:
              errorMessage = 'Datos de entrada inválidos';
              break;
            case 401:
              errorMessage = 'No autorizado. Por favor, inicia sesión';
              break;
            case 403:
              errorMessage = 'Acceso denegado';
              break;
            case 404:
              errorMessage = 'Recurso no encontrado';
              break;
            case 422:
              errorMessage = 'Datos de validación incorrectos';
              break;
            case 500:
              errorMessage = 'Error interno del servidor';
              break;
            case 0:
              errorMessage = 'No se puede conectar con el servidor. Verifica tu conexión';
              break;
            default:
              errorMessage = `Error ${error.status}: ${error.message}`;
          }
        }
        
        console.error('Error HTTP:', error);
        console.error('Mensaje de error:', errorMessage);
        
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
