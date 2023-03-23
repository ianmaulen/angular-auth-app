import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, throwError, tap } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthResponse } from '../auth/interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(private router: Router) { }

  intercept(req: HttpRequest<AuthResponse>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    const token = localStorage.getItem('token');

    let request = req;

    if (token) {
      request = req.clone({
        setHeaders: {
          'x-token': `${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError( (err: HttpErrorResponse) => {
        if (err.status) {
          Swal.fire('Error', err.error.msg, 'error')
          this.router.navigate(['/auth/login'])
        }
        
        return throwError(() => new Error(err.error.msg));

      })
    );
  }

}
