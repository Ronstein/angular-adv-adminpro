import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { map } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { Hospital } from '../models/hospital.model';
import { Medico } from '../models/medico.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

  constructor(
    private http: HttpClient,
  ) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  private transformarUsuarios(resultados: any[]): Usuario[] {
    return resultados.map(
      user => new Usuario(user.nombre, user.email, '', user.img, user.role, user.google, user.uid)
    );
  }

  private transformarHospitales(resultados: any[]): Hospital[] {
    // return resultados.map(
    //   hospital => new Hospital(hospital.nombre, hospital._id, hospital.img)
    // );
    return resultados;
  }

  private transformarMedicos(resultados: any[]): Medico[] {
    // return resultados.map(
    //   hospital => new Hospital(hospital.nombre, hospital._id, hospital.img)
    // );
    return resultados;
  }

  busquedaGlobal(termino: string) {
    const url = `${base_url}/todo/${termino}`;
    return this.http.get(url, this.headers)
  }

  buscar(tipo: 'usuarios' | 'medicos' | 'hospitales',
    termino: string
  ) {
    const url = `${base_url}/todo/coleccion/${tipo}/${termino}`;
    return this.http.get(url, this.headers)
      .pipe(
        map((resp: any) => {
          switch (tipo) {
            case 'usuarios':
              return this.transformarUsuarios(resp.resultados)
            case 'hospitales':
              return this.transformarHospitales(resp.resultados)
            case 'medicos':
              return this.transformarMedicos(resp.resultados)
            default:
              return [];
          }
        })
      );
  }

}
