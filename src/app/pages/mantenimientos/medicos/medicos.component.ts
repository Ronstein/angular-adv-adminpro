import { Component, OnDestroy, OnInit } from '@angular/core';
import { Medico } from '../../../models/medico.model';
import { delay, Subscription } from 'rxjs';
import { MedicoService } from '../../../services/medico.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { BusquedasService } from '../../../services/busquedas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: ``
})
export class MedicosComponent implements OnInit, OnDestroy {

  public medicos: Medico[] = [];
  public cargando: boolean = true;
  public totalMedicos: number = 0;
  public desde: number = 0;
  private imgSubs!: Subscription;
  public medicosTemp: Medico[] = [];

  constructor(
    private medicoService: MedicoService,
    private modalImagenService: ModalImagenService,
    private busquedasService: BusquedasService,
  ) { }

  ngOnInit(): void {
    this.cargarMedicos();
    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(
        //Este delay es necesario ya que es demasiado rapido el cambio
        //y no se ve reflejado inmediatamente el cambio de imagen
        delay(100)
      )
      .subscribe(img => this.cargarMedicos());
  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  cargarMedicos() {
    this.cargando = true;
    this.medicoService.cargarMedicos(this.desde)
      .subscribe(({ total, medicos }) => {
        this.cargando = false;
        this.medicos = medicos;
        this.totalMedicos = total;
        this.medicosTemp = medicos;
      });
  }

  cambiarPagina(valor: number) {
    this.desde += valor;

    if (this.desde < 0) this.desde = 0;
    if (this.desde >= this.totalMedicos) this.desde -= valor;
    //console.log(this.hospitales.length);

    this.cargarMedicos();
  }

  borrarMedico(medico: Medico) {

    return Swal.fire({
      title: "Eliminar Médico",
      text: `Esta a punto de eliminar a ${medico.nombre}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Confirmar Eliminación"
    }).then((result) => {
      if (result.isConfirmed) {
        this.medicoService.borrarMedico(medico._id!)
          .subscribe(resp => {
            this.cargarMedicos()
            Swal.fire('Borrado', `${medico.nombre} Borrado`, 'success')
          });
      }
    });
  }

  abrirModal(medico: Medico) {
    this.modalImagenService.abrirModal('medicos', medico._id!, medico.img);
  }

  buscar(termino: string) {
    if (termino.length === 0) return this.medicos = this.medicosTemp;
    //console.log(termino);
    return this.busquedasService.buscar('medicos', termino)
      .subscribe((resultados) => {
        this.medicos = resultados;
      })
  }

}
