import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IngrementadorComponent } from './ingrementador/ingrementador.component';
import { DonaComponent } from './dona/dona.component';

import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
       IngrementadorComponent,
       DonaComponent],
  exports:[
    IngrementadorComponent,
    DonaComponent],
  imports: [
    CommonModule,
    FormsModule,
    ChartsModule
  ]
})
export class ComponentsModule { }
