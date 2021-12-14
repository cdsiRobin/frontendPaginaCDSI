import {PedidoComponent} from './pedido.component';
import {PedidoEdicionComponent} from './pedido-edicion/pedido-edicion.component';
import {CajaComponent} from './caja/caja.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: 'pedido', component: PedidoComponent,
    children: [
          // { path: '', component: PedidoComponent },
          { path: 'nuevo', component: PedidoEdicionComponent },
          { path: 'edicion/:orden', component: PedidoEdicionComponent },
          { path: 'caja', component: CajaComponent }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})

export class PedidoRoutingModule { }
