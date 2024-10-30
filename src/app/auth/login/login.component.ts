import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';

declare const google: any

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {

  @ViewChild('googleBtn') googleBtn!: ElementRef;

  public loginForm: FormGroup = new FormGroup({});
  public formSubmitted = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
  ) { }

  ngAfterViewInit(): void {
    this.googleInit();
  }

  googleInit() {
    google.accounts.id.initialize({
      client_id: "750532637940-a7q3g14vrfsl7e0d64kv2tng13eoma9c.apps.googleusercontent.com",
      callback: (response: any) => this.handleCredentialResponse(response)
    });
    google.accounts.id.renderButton(
      // document.getElementById("buttonDiv"),
      this.googleBtn.nativeElement,
      { theme: "outline", size: "large" }  // customization attributes
    );
  }

  handleCredentialResponse(response: any) {
    //console.log("Encoded JWT ID token: " + response.credential);
    this.usuarioService.loginGoogle(response.credential)
      .subscribe(resp => {
        //login: resp;
        this.router.navigateByUrl('/');
      });
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: [localStorage.getItem('email') ?? '', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      remember: [localStorage.getItem('remember')],
    });
  }

  login() {
    //console.log('submit');
    //this.router.navigateByUrl('/');
    //console.log(this.loginForm.value);
    this.usuarioService.login(this.loginForm.value)
      .subscribe(resp => {
        //console.log('Usuario logueado', resp);
        if (this.loginForm.get('remember')!.value) {
          localStorage.setItem('email', this.loginForm.get('email')!.value);
          localStorage.setItem('remember', this.loginForm.get('remember')!.value);
        } else {
          localStorage.removeItem('email');
          localStorage.removeItem('remember');
        }
        // Navegar al Dashboard
        this.router.navigateByUrl('/');
      }, (err) => {
        Swal.fire('Error', err.error.msg, 'error');
      });
  }
}
