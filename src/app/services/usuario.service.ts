import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterForm } from '../interfaces/register-form.interface';
import { environment } from '../../environments/environment';
import { LoginForm } from '../interfaces/login-form.interface';
import { catchError, delay, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { CargarUsuario } from '../interfaces/cargar-usuarios.interface';

declare const google: any;

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public usuario!: Usuario;

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

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
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
      this.headers
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

  cargarUsuarios(desde: number = 0) {
    const url = `${base_url}/usuarios?desde=${desde}`;
    return this.http.get<CargarUsuario>(url, this.headers)
      .pipe(
        //delay(300),
        map(resp => {
          const usuarios = resp.usuarios.map(
            user => new Usuario(user.nombre, user.email, '', user.img, user.role, user.google, user.uid)
          );
          return {
            total: resp.total,
            usuarios
          };
        })
      )
  }

  eliminarUsuario(usuario: Usuario) {
    //console.log('eliminando');
    const url = `${base_url}/usuarios/${usuario.uid}`;
    return this.http.delete(url, this.headers);
  }

  guardarUsuario(usuario: Usuario) {

    return this.http.put(
      `${base_url}/usuarios/${usuario.uid}`,
      usuario,
      this.headers
    );
  }
}
