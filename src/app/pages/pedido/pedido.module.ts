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
import { ListapedComponent } from './listaped/listaped.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorService } from '../../interceptor/interceptor.service';

@NgModule({
  declarations: [
    CajaComponent,
    CajaEdicionComponent,
    PedidoComponent,
    PedidoEdicionComponent,
    VendedorComponent,
    DialogSerieComponent,
    ListapedComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    AppRoutingModule
  ], providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    }
  ]
})
export class PedidoModule { }
