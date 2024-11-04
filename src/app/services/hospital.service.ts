import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { map } from 'rxjs';
import { Hospital } from '../models/hospital.model';
import { CargarHospital } from '../interfaces/cargar-hospitales.interface';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  constructor(
    private http: HttpClient,
    // private router: Router,
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

  cargarHospitales(desde: number = 0, limite: number = 5) {
    const url = `${base_url}/hospitales?desde=${desde}&limite=${limite}`;
    return this.http.get<CargarHospital>(url, this.headers)
      .pipe(
        map((hospitales) => hospitales)
      );
  }

  crearHospital(nombre: string) {
    const url = `${base_url}/hospitales`;
    return this.http.post<{ ok: boolean, hospital: Hospital }>(url, { nombre }, this.headers);
  }

  actualizarHospital(_id: string, nombre: string) {
    const url = `${base_url}/hospitales/${_id}`;
    return this.http.put(url, { nombre }, this.headers);
  }

  borrarHospital(_id: string) {
    const url = `${base_url}/hospitales/${_id}`;
    return this.http.delete(url, this.headers);
  }


}
