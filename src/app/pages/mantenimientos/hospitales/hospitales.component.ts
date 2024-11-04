import { Component, OnDestroy, OnInit } from '@angular/core';
import { HospitalService } from '../../../services/hospital.service';
import { Hospital } from '../../../models/hospital.model';
import Swal from 'sweetalert2';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { delay, Subscription } from 'rxjs';
import { BusquedasService } from '../../../services/busquedas.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: ``
})
export class HospitalesComponent implements OnInit, OnDestroy {

  public hospitales: Hospital[] = [];
  public cargando: boolean = true;
  public totalHospitales: number = 0;
  public desde: number = 0;
  private imgSubs!: Subscription;
  public hospitalesTemp: Hospital[] = [];

  constructor(
    private hospitalService: HospitalService,
    private modalImagenService: ModalImagenService,
    private busquedasService: BusquedasService,
  ) { }

  ngOnInit(): void {
    this.cargarHospitales();
    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(
        //Este delay es necesario ya que es demasiado rapido el cambio
        //y no se ve reflejado inmediatamente el cambio de imagen
        delay(100)
      )
      .subscribe(img => this.cargarHospitales());
  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  cargarHospitales() {
    this.cargando = true;
    this.hospitalService.cargarHospitales(this.desde)
      .subscribe(({ total, hospitales }) => {
        this.cargando = false;
        this.hospitales = hospitales;
        this.totalHospitales = total;
        this.hospitalesTemp = hospitales;
      });
  }

  cambiarPagina(valor: number) {
    this.desde += valor;

    if (this.desde < 0) this.desde = 0;
    if (this.desde >= this.totalHospitales) this.desde -= valor;
    //console.log(this.hospitales.length);

    this.cargarHospitales();
  }

  guardarCambios(hospital: Hospital) {
    this.hospitalService.actualizarHospital(hospital._id!, hospital.nombre)
      .subscribe(resp => {
        Swal.fire('Actualizado', `${hospital.nombre} Actualizado`, 'success')
      });
  }

  eliminarHospital(hospital: Hospital) {

    return Swal.fire({
      title: "Eliminar Hospital",
      text: `Esta a punto de eliminar a ${hospital.nombre}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Confirmar Eliminación"
    }).then((result) => {
      if (result.isConfirmed) {
        this.hospitalService.borrarHospital(hospital._id!)
          .subscribe(resp => {
            this.cargarHospitales()
            Swal.fire('Borrado', `${hospital.nombre} Borrado`, 'success')
          });
      }
    });
  }

  async abrirSweetAlert() {
    const { value = '' } = await Swal.fire<string>({
      title: 'Crear Hospital',
      input: "text",
      inputLabel: "Ingrese el Nombre del Nuevo Hospital",
      inputPlaceholder: "Nombre del Hospital",
      showCancelButton: true,
    });
    //console.log(value);
    if (value!.trim().length > 0) {
      this.hospitalService.crearHospital(value!)
        .subscribe(resp => {
          //console.log(resp);
          this.hospitales.push(resp.hospital);
          this.totalHospitales++;
        })
    }
  }

  abrirModal(hospital: Hospital) {
    this.modalImagenService.abrirModal('hospitales', hospital._id!, hospital.img);
  }

  buscar(termino: string) {
    if (termino.length === 0) return this.hospitales = this.hospitalesTemp;
    //console.log(termino);
    return this.busquedasService.buscar('hospitales', termino)
      .subscribe((resultados) => {
        this.hospitales = resultados;
      })
  }

}
