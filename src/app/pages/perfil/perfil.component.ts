import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';
import Swal from 'sweetalert2';
import { FileUploadService } from '../../services/file-upload.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: ``
})
export class PerfilComponent implements OnInit {

  public perfilForm!: FormGroup;
  public usuario!: Usuario;
  public imagenSubir?: File;
  public imgTemp: any = null;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private fileUploadService: FileUploadService,
  ) {
    this.usuario = usuarioService.usuario!;
  }

  ngOnInit(): void {
    this.perfilForm = this.fb.group({
      nombre: [this.usuario.nombre, Validators.required],
      email: [this.usuario.email, [Validators.required, Validators.email]],
    });
  }


  actualizarPerfil() {
    console.log(this.perfilForm.value);
    this.usuarioService.actualizarPerfil(this.perfilForm.value)
      .subscribe(() => {
        const { nombre, email } = this.perfilForm.value;
        this.usuario.nombre = nombre;
        this.usuario.email = email;
        Swal.fire('Usuario Actualizado', 'Usuario Actualizado correctamente', 'success')
      }, (err) => {
        //console.log(err.error.msg);
        Swal.fire('Error', err.error.msg, 'error')
      })
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
    this.fileUploadService
      .actualizarFoto(this.imagenSubir!, 'usuarios', this.usuario.uid!)
      .then(img => {
        this.usuario.img = img;
        this.imgTemp = null;
        this.imagenSubir = undefined;
        Swal.fire('Imagen Actualizada', 'Imagen Actualizada correctamente', 'success');
      })
      .catch((err) => {
        console.log(err);
        Swal.fire('Error', 'No se pudo subir la imagen', 'error')
      });
    // .then(console.log)
  }

}
