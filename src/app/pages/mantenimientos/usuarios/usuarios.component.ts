import { Component, OnDestroy, OnInit } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../models/usuario.model';
import { BusquedasService } from '../../../services/busquedas.service';
import Swal from 'sweetalert2';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { delay, Subscription } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: ``
})
export class UsuariosComponent implements OnInit, OnDestroy {
  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];
  public desde: number = 0;
  public cargando: boolean = true;
  public uid: string = '';
  public imgSubs!: Subscription;

  constructor(
    private usuarioService: UsuarioService,
    private busquedasService: BusquedasService,
    private modalImagenService: ModalImagenService,
  ) { }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.uid = this.usuarioService.usuario!.uid!;
    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(
        //Este delay es necesario ya que es demasiado rapido el cambio
        //y no se ve reflejado inmediatamente el cambio de imagen
        delay(100)
      )
      .subscribe(img => this.cargarUsuarios())
  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  cargarUsuarios() {
    this.cargando = true;
    this.usuarioService.cargarUsuarios(this.desde)
      .subscribe(({ total, usuarios }) => {
        this.totalUsuarios = total;
        this.usuarios = usuarios;
        this.usuariosTemp = usuarios;
        this.cargando = false;
      })
  }

  cambiarPagina(valor: number) {
    this.desde += valor;

    if (this.desde < 0) this.desde = 0;
    if (this.desde >= this.totalUsuarios) this.desde -= valor;

    this.cargarUsuarios();
  }

  buscar(termino: string) {
    if (termino.length === 0) return this.usuarios = this.usuariosTemp;
    //console.log(termino);
    return this.busquedasService.buscar('usuarios', termino)
      .subscribe(resultados => {
        this.usuarios = resultados;
      })
  }

  eliminarUsuario(usuario: Usuario) {

    if (usuario.uid === this.uid) {
      return Swal.fire('Error', 'No puede eliminarse a si mismo', 'error');
    }

    return Swal.fire({
      title: "Eliminar Usuario",
      text: `Esta a punto de eliminar a ${usuario.nombre}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Confirmar Eliminación"
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.eliminarUsuario(usuario)
          .subscribe(resp => {
            Swal.fire(
              'Usuario Eliminado',
              `${usuario.nombre} fue eliminado correctamente`,
              'success'
            );
            this.cargarUsuarios();
          });
      }
    });
  }

  cambiarRole(usuario: Usuario) {
    // console.log(usuario);
    this.usuarioService.guardarUsuario(usuario)
      .subscribe(resp => {
        //console.log(resp);
      })
  }

  abrirModal(usuario: Usuario) {
    //console.log(usuario);
    this.modalImagenService.abrirModal('usuarios', usuario.uid!, usuario.img);
  }

}
