import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public registerForm!: FormGroup;
  public formSubmitted = false;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      nombre: ['test100', [Validators.required, Validators.minLength(3)]],
      email: ['test100@gmail.com', [Validators.required, Validators.email]],
      password: ['123456', Validators.required],
      password2: ['123456', Validators.required],
      terminos: [true, Validators.requiredTrue],
    }, {
      validators: this.passwordsIguales('password', 'password2')
    });
  }

  crearUsuario() {
    this.formSubmitted = true;
    //console.log(this.registerForm.value);
    if (this.registerForm.invalid) return;

    this.usuarioService.crearUsuario(this.registerForm.value)
      .subscribe(resp => {
        //console.log('Usuario creado', resp);
        this.router.navigateByUrl('/');
      }, (err) => {
        //err.error.msg
        Swal.fire('Error', err.error.msg, 'error');
      });
  }

  campoNoValido(campo: string): boolean {
    if (this.registerForm.get(campo)!.invalid && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  contrasenasNoValidas() {
    const pass1 = this.registerForm.get('password')!.value;
    const pass2 = this.registerForm.get('password2')!.value;
    if (pass1 !== pass2 && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  passwordsIguales(pass1Name: string, pass2Name: string) {
    return (formGroup: FormGroup) => {
      const pass1Control = formGroup.get(pass1Name)!;
      const pass2Control = formGroup.get(pass2Name)!;

      // Si la primera contraseña está vacía, establece el error 'required' en password
      if (!pass1Control.value) {
        pass1Control.setErrors({ required: true });
      } else {
        pass1Control.setErrors(null); // Limpia el error si ya tiene valor
      }

      // Si ambas contraseñas tienen valor y no son iguales, establece el error 'noEsIgual' en password2
      if (pass1Control.value && pass1Control.value !== pass2Control.value) {
        pass2Control.setErrors({ noEsIgual: true });
      } else {
        pass2Control.setErrors(null); // Limpia el error si coinciden o están vacías
      }
    };
  }

  // aceptaTerminos() {
  //   return !this.registerForm.get('terminos')!.value && this.formSubmitted;
  // }
}
