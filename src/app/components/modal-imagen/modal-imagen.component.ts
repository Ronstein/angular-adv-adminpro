import { Component } from '@angular/core';
import { ModalImagenService } from '../../services/modal-imagen.service';
import { FileUploadService } from '../../services/file-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: ``
})
export class ModalImagenComponent {
  //public ocultarModal: boolean = false;
  public imagenSubir?: File;
  public imgTemp: any = null;

  constructor(
    public modalImagenService: ModalImagenService,
    public fileUploadService: FileUploadService,
  ) { }

  cerrarModal() {
    this.imgTemp = null;
    this.modalImagenService.cerrarModal();
  }

  cambiarImagen(event: Event) {
    const input = event.target as HTMLInputElement;

    // Verifica si no hay archivo seleccionado o si se canceló la selección
    if (!input.files || input.files.length === 0) {
      // console.log('No se seleccionó ningún archivo');
      this.imgTemp = null;
      this.imagenSubir = undefined;
      return;
    }

    const file: File = input.files[0];
    this.imagenSubir = file;
    //console.log(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      this.imgTemp = reader.result;
      //console.log(this.imgTemp); // Muestra el resultado en consola para verificar
    };
    reader.readAsDataURL(file);
  }

  subirImagen() {
    const { id, tipo } = this.modalImagenService;

    this.fileUploadService
      .actualizarFoto(this.imagenSubir!, tipo, id)
      .then(img => {
        this.imgTemp = null;
        this.imagenSubir = undefined;
        Swal.fire('Imagen Actualizada', 'Imagen Actualizada correctamente', 'success');
        this.modalImagenService.nuevaImagen.emit(img);
        this.cerrarModal();
      })
      .catch((err) => {
        console.log(err);
        Swal.fire('Error', 'No se pudo subir la imagen', 'error')
      });
    // .then(console.log)
  }
}
