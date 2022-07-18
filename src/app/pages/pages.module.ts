import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from './../material/material.module';
import { PagiRgtaComponent1 } from './pagi-rgta1/pagi-rgta1.component';
import { LartiComponent } from './larti/larti.component';
import { ComponentsModule } from './../components/components.module';
import { AppRoutingModule } from './../app-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PagesComponent } from './pages.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { ProgressComponent } from './progress/progress.component';
import { ConsultaEspecialComponent } from './consulta-especial/consulta-especial.component';
import { IsanegComponent } from './isaneg/isaneg.component';
import { NuestraEmpresaComponent } from './nuestra-empresa/nuestra-empresa.component';
import { NuestroServicioComponent } from './nuestro-servicio/nuestro-servicio.component';
import { PcpeProduccionComponent } from './pcpe-produccion/pcpe-produccion.component';
import { PcpeSgcorComponent } from './pcpe-sgcor/pcpe-sgcor.component';
import { PcpeSgdiComponent } from './pcpe-sgdi/pcpe-sgdi.component';
import { PcpeSilegComponent } from './pcpe-sileg/pcpe-sileg.component';
import { NuestroProductosComponent } from './nuestro-productos/nuestro-productos.component';
import { SgcorComponent } from './sgcor/sgcor.component';
import { TrabajosRealizadosComponent } from './trabajos-realizados/trabajos-realizados.component';
import { CioComponent } from './cio/cio.component';
import { CiopeComponent } from './ciope/ciope.component';
import { ClientesComponent } from './clientes/clientes.component';
import { CapacitacionComponent } from './capacitacion/capacitacion.component';
import { AlianzasComponent } from './alianzas/alianzas.component';
import { AsistenciaComponent } from './asistencia/asistencia.component';
import { CabezeraComponent } from './cabezera/cabezera.component';
import { CompanyComponent } from './company/company.component';
import { GelocationComponent } from './gelocation/gelocation.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { PagiRgtaComponent } from './pagi-rgta/pagi-rgta.component';
import { RegistroComponent } from './registro/registro.component';
import { RgtacdeComponent } from './rgtacde/rgtacde.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { Login2Component } from './login2/login2.component';

import { MenuPventaComponent } from './login2/menu-pventa/menu-pventa.component';

import {PedidoModule} from './pedido/pedido.module';
import { ArfafeModule } from './facturacion/arfafe.module';
import { ItemsDialogoComponent } from './articulo/items-dialogo/items-dialogo.component';
import { ArcgtcModule } from './arcgtc/arcgtc.module';
import { ArccmcComponent } from './arccmc/arccmc.component';
import { ItemModule } from './items/item.module';
import { ArccvcComponent } from './arccvc/arccvc.component';
import { MarccmcComponent } from './arccmc/marccmc/marccmc.component';
import { ArfamcComponent } from './arfamc/arfamc.component';
import { NotacreditoComponent } from './notacredito/notacredito.component';
import { NotacreditoModule } from './notacredito/notacredito.module';
import { ConceptoComponent } from './concepto/concepto.component';
import { ArcctdaComponent } from './arcctda/arcctda.component';
import { ArfaccComponent } from './arfacc/arfacc.component';

@NgModule({
  declarations: [
    ProgressComponent,
    Grafica1Component,
    PagesComponent,
    ConsultaEspecialComponent,
    IsanegComponent,
    NuestraEmpresaComponent,
    NuestroServicioComponent,
    PcpeProduccionComponent,
    PcpeSgcorComponent,
    PcpeSgdiComponent,
    PcpeSilegComponent,
    NuestroProductosComponent,
    SgcorComponent,
    TrabajosRealizadosComponent,
    CioComponent,
    CiopeComponent,
    ClientesComponent,
    CapacitacionComponent,
    AlianzasComponent,
    AsistenciaComponent,
    CabezeraComponent,
    CompanyComponent,
    GelocationComponent,
    HomeComponent,
    LoginComponent,
    LartiComponent,
    PagiRgtaComponent1,
    PagiRgtaComponent,
    RegistroComponent,
    RgtacdeComponent,
    UsuarioComponent,
    Login2Component,
    MenuPventaComponent,
    ItemsDialogoComponent,
    ArccmcComponent,
    ArccvcComponent,
    MarccmcComponent,
    ArfamcComponent,
    NotacreditoComponent,
    ConceptoComponent,
    ArcctdaComponent,
    ArfaccComponent
  ],
  exports: [
    ProgressComponent,
    Grafica1Component,
    PagesComponent,
    SharedModule,
  ],
  imports: [
    CommonModule,
    SharedModule,
    AppRoutingModule,
    FormsModule,
    ComponentsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    PedidoModule,
    ArfafeModule,
    NotacreditoModule,
    ItemModule,
    ArcgtcModule,
    MaterialModule
  ]
})
export class PagesModule { }
