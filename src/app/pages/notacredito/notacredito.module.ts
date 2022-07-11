import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material/material.module';
import { AppRoutingModule } from '../../app-routing.module';
import { ListancComponent } from './listanc/listanc.component';
import { ItemsncComponent } from './itemsnc/itemsnc.component';
import { SinitemncComponent } from './sinitemnc/sinitemnc.component';


@NgModule({
  declarations: [ListancComponent, ItemsncComponent, SinitemncComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    AppRoutingModule
  ]
})
export class NotacreditoModule { }
