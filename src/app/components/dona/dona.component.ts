import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartData } from 'chart.js';

@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  styles: ``
})
export class DonaComponent implements OnChanges {


  @Input() public titulo: string = 'Sin Título';

  // @Input('labels') labels: string[] = [
  //   'Download Sales',
  //   'In-Store Sales',
  //   'Mail-Order Sales',
  // ];
  @Input() data: number[] = [350, 550, 100];

  // Doughnut
  @Input('labels') public doughnutChartLabels: string[] = [
    'Download Sales', 'In-Store Sales', 'Mail-Order Sales',
  ];

  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [
      {
        data: this.data,
        backgroundColor: ['#6857E6', '#009FEE', '#F02059'], // Colores personalizados
        hoverBackgroundColor: ['#7C69F6', '#00B0FF', '#F24171'] // Colores al hacer hover (similares)
      },

    ],
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['doughnutChartLabels'] || changes['data']) {
      this.updateChartData();
    }
  }

  private updateChartData(): void {
    this.doughnutChartData = {
      labels: this.doughnutChartLabels,
      datasets: [
        {
          data: this.data,
          backgroundColor: ['#6857E6', '#009FEE', '#F02059'],
          hoverBackgroundColor: ['#7C69F6', '#00B0FF', '#F24171']
        },
      ],
    };
  }
}

