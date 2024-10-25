import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: ``
})
export class Grafica1Component {

  public labels1: string[] = [
    'Food Sales', 'Beer Sales', 'Sex Sales',
  ];
  public data1: number[] = [600, 250, 150];
}
