import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterForm } from '../interfaces/register-form.interface';
import { environment } from '../../environments/environment';
import { LoginForm } from '../interfaces/login-form.interface';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

declare const google: any;

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  crearUsuario(formData: RegisterForm) {
    //console.log('creando usuario')
    return this.http.post(`${base_url}/usuarios`, formData)
      .pipe(
        tap((resp: any) => {
          //console.log(resp);
          localStorage.setItem('token', resp.token)
        })
      );
  }

  login(formData: LoginForm) {
    return this.http.post(`${base_url}/login`, formData)
      .pipe(
        tap((resp: any) => {
          //console.log(resp);
          localStorage.setItem('token', resp.token)
        })
      );
  }

  loginGoogle(token: string) {
    return this.http.post(`${base_url}/login/google`, { token })
      .pipe(
        tap((resp: any) => {
          //console.log(resp);
          localStorage.setItem('token', resp.token)
        })
      )
  }

  validarToken(): Observable<boolean> {
    const token = localStorage.getItem('token') ?? '';
    return this.http.get(`${base_url}/login/renew`,
      { headers: { 'x-token': token } })
      .pipe(
        tap((resp: any) => {
          localStorage.setItem('token', resp.token)
        }),
        map(resp => true),
        catchError(error => of(false))
      );
  }

  logout() {
    localStorage.removeItem('token');

    google.accounts.id.revoke('ron.pavezb@gmail.com', () => {
      this.router.navigateByUrl('/login');
    });
  }
}
