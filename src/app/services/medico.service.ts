import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CargarMedico } from '../interfaces/cargar-medicos.interface';
import { catchError, map, of } from 'rxjs';
import { Medico } from '../models/medico.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class MedicoService {
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

  cargarMedicos(desde: number = 0) {
    const url = `${base_url}/medicos?desde=${desde}`;
    return this.http.get<CargarMedico>(url, this.headers)
      .pipe(
        map((medicos) => medicos)
      );
  }

  obtenerMedicoPorId(id: string) {
    const url = `${base_url}/medicos/${id}`;
    return this.http.get<{ ok: boolean, medico?: Medico }>(url, this.headers)
      .pipe(
        //map((medico) => medico),
        map(response => response.medico || undefined), // Devolver undefined si no existe el médico
        catchError(() => of(undefined)) // En caso de error, devolver undefined
      );
  }

  crearMedico(medico: { nombre: string, hospital: string }) {
    const url = `${base_url}/medicos`;
    return this.http.post<{ ok: boolean, medico: Medico }>(url, medico, this.headers);
  }

  actualizarMedico(medico: Medico) {
    const url = `${base_url}/medicos/${medico._id}`;
    return this.http.put(url, medico, this.headers);
  }

  borrarMedico(_id: string) {
    const url = `${base_url}/medicos/${_id}`;
    return this.http.delete(url, this.headers);
  }

}
