import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthResponse, Usuario } from '../interfaces/interfaces';
import { catchError, map, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl: string = 'http://localhost:4000/api/';
  private _usuario!: Usuario;

  get usuario() {
    return { ...this._usuario };
  }



  constructor( private http: HttpClient ) { }



  login(email: string, password: string) {
    
    const url = `${this.apiUrl}auth`;
    const body = {email: email, password: password}

    return this.http.post<AuthResponse>( url, body )
      .pipe(
        tap( res => {
          if (res.ok) {
            localStorage.setItem('token', res.token!);
            this._usuario = {
              name: res.name!,
              uid: res.uid!,
            }
          }
        } ),
        map( resp => resp.ok )
      )
  }


  validarToken(): Observable<boolean> {
    const url = `${this.apiUrl}auth/renew`;
    return this.http.get<AuthResponse>( url ).pipe(map( res => {
      this._usuario = {
        name: res.name!,
        uid: res.uid!,
      }
      return res.ok;
    })
    );
  }




  register(name: string, email: string, password: string) {
    const url = `${this.apiUrl}auth/new`;
    const body = {name: name, email: email, password: password}

    return this.http.post<AuthResponse>( url, body )
    .pipe(
      map( res => res.ok ),
    )
  }


}
