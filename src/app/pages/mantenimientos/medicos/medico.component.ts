import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HospitalService } from '../../../services/hospital.service';
import { Hospital } from '../../../models/hospital.model';
import { MedicoService } from '../../../services/medico.service';
import { Medico } from '../../../models/medico.model';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: ``
})
export class MedicoComponent implements OnInit {

  public medicoForm!: FormGroup;
  public hospitales: Hospital[] = [];
  public medicoSeleccionado?: Medico;
  public hospitalSeleccionado?: Hospital;

  constructor(
    private fb: FormBuilder,
    private hospitalService: HospitalService,
    private medicoService: MedicoService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {

    this.activatedRoute.params
      .subscribe(({ id }) => {
        // console.log(id);
        this.cargarMedico(id);
      });

    // this.medicoService.obtenerMedicoPorId();

    this.cargarHospitales();

    this.medicoForm = this.fb.group({
      nombre: ['', Validators.required],
      hospital: ['', Validators.required],
    });

    this.medicoForm.get('hospital')?.valueChanges
      .subscribe(hospitalId => {
        //console.log(hospitalId);
        this.hospitalSeleccionado = this.hospitales
          .find(h => h._id === hospitalId);
        //console.log(this.hospitalSeleccionado);

      });
  }

  cargarMedico(id: string) {

    if (id === 'nuevo') return;

    this.medicoService.obtenerMedicoPorId(id)
      .pipe(
        delay(100)
      )
      .subscribe((medico) => {
        if (!medico) {
          this.router.navigateByUrl(`/dashboard/medicos`);
          return;
        }
        //console.log(medico);
        const nombre = medico.nombre;
        const _id = medico.hospital ? medico.hospital._id : undefined;
        //console.log(nombre, _id);
        this.medicoSeleccionado = medico;
        this.medicoForm.setValue({ nombre, hospital: _id });
      });
  }

  cargarHospitales() {
    this.hospitalService.cargarHospitales(undefined, 0)
      .subscribe(({ hospitales }) => {
        //console.log(hospitales);
        this.hospitales = hospitales;
      });
  }

  guardarMedico() {
    //console.log(this.medicoForm.value);
    const { nombre } = this.medicoForm.value

    if (this.medicoSeleccionado) {
      //todo: actualizar
      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id
      }
      this.medicoService.actualizarMedico(data)
        .subscribe(resp => {
          //console.log(resp);
          Swal.fire('Actualizado', `${nombre} actualizado correctamente`, 'success');
        });

    } else {
      this.medicoService.crearMedico(this.medicoForm.value)
        .subscribe(resp => {
          //console.log(resp);
          Swal.fire('Creado', `${nombre} creado correctamente`, 'success');
          this.router.navigateByUrl(`/dashboard/medico/${resp.medico._id}`)
        });
    }

  }

}
