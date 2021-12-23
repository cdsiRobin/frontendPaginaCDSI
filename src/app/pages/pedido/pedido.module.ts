import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CajaComponent} from './caja/caja.component';
import {CajaEdicionComponent} from './caja/caja-edicion/caja-edicion.component';
import {PedidoComponent} from './pedido.component';
import {PedidoEdicionComponent} from './pedido-edicion/pedido-edicion.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../material/material.module';
import {AppRoutingModule} from '../../app-routing.module';
import {VendedorComponent} from '../vendedor/vendedor.component';
import { DialogSerieComponent } from './dialog-serie/dialog-serie.component';

@NgModule({
  declarations: [
    CajaComponent,
    CajaEdicionComponent,
    PedidoComponent,
    PedidoEdicionComponent,
    VendedorComponent,
    DialogSerieComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    AppRoutingModule
  ]
})
export class PedidoModule { }
