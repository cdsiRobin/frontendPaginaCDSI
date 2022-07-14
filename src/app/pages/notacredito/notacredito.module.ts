import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material/material.module';
import { AppRoutingModule } from '../../app-routing.module';
import { ListancComponent } from './listanc/listanc.component';
import { ItemsncComponent } from './itemsnc/itemsnc.component';
import { SinitemncComponent } from './sinitemnc/sinitemnc.component';
import { BrowserModule } from '@angular/platform-browser';
import { ComprobIngreDialogoComponent } from './comprob-ingre-dialogo/comprob-ingre-dialogo.component';

@NgModule({
  declarations: [ListancComponent, ItemsncComponent, SinitemncComponent, ComprobIngreDialogoComponent],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    AppRoutingModule
  ]
})
export class NotacreditoModule { }
