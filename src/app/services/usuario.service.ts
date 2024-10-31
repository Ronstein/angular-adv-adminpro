import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterForm } from '../interfaces/register-form.interface';
import { environment } from '../../environments/environment';
import { LoginForm } from '../interfaces/login-form.interface';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';

declare const google: any;

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public usuario?: Usuario;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get uid(): string {
    return this.usuario?.uid ?? '';
  }
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

  actualizarPerfil(data: { email: string, nombre: string, role: string }) {

    data = {
      ...data,
      role: this.usuario!.role ?? 'USER_ROLE'
    }

    return this.http.put(
      `${base_url}/usuarios/${this.uid}`,
      data,
      {
        headers: {
          'x-token': this.token
        }
      });
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

    return this.http.get(`${base_url}/login/renew`,
      { headers: { 'x-token': this.token } })
      .pipe(
        map((resp: any) => {
          //console.log(resp);
          const { email, google, nombre, role, uid, img = '' } = resp.usuario;
          this.usuario = new Usuario(
            nombre, email, '', img, role, google, uid
          );
          localStorage.setItem('token', resp.token);
          return true;
        }),
        catchError(error => of(false))
      );
  }

  logout() {
    localStorage.removeItem('token');
    if (this.usuario?.google) {
      google.accounts.id.revoke(this.usuario?.email, () => {
        this.router.navigateByUrl('/login');
      });
    } else {
      this.router.navigateByUrl('/login');
    }
  }
}
