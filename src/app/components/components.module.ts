import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncrementadorComponent } from './incrementador/incrementador.component';
import { FormsModule } from '@angular/forms';
import { DonaComponent } from './dona/dona.component';
import { provideCharts, withDefaultRegisterables, BaseChartDirective } from 'ng2-charts';


@NgModule({
  providers: [
    provideCharts(withDefaultRegisterables())
  ],
  declarations: [
    IncrementadorComponent,
    DonaComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    BaseChartDirective,
  ],
  exports: [
    IncrementadorComponent,
    DonaComponent,
  ]
})
export class ComponentsModule { }
