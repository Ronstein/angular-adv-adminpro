import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: ``
})
export class IncrementadorComponent implements OnInit {

  // @Input() public progreso: number = 10;
  @Input('valor') public progreso: number = 10;
  @Input() public btnClass: string = 'btn-primary';

  @Output('valor') valorSalida: EventEmitter<number> = new EventEmitter();

  ngOnInit() {
    this.btnClass = `btn ${this.btnClass}`
  }

  cambiarValor(valor: number) {
    if (this.progreso + valor > 100) return;
    if (this.progreso + valor < 0) return;

    this.progreso += valor;
    this.valorSalida.emit(this.progreso);
    //this.progreso = this.progreso + valor;
  }

  onChange(nuevoValor: number) {
    if (nuevoValor >= 100) {
      this.progreso = 100;
    } else if (nuevoValor <= 0) {
      this.progreso = 0;
    } else {
      this.progreso = nuevoValor;
    }
    this.valorSalida.emit(this.progreso);
    //console.log(this.progreso);

  }
}
