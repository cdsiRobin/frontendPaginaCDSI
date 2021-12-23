import {PedidoComponent} from './pedido.component';
import {PedidoEdicionComponent} from './pedido-edicion/pedido-edicion.component';
import {CajaComponent} from './caja/caja.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ArfafeComponent } from '../facturacion/arfafe.component';
import { ListArfafeComponent } from '../facturacion/list-arfafe/list-arfafe.component';
import { NewArfafeComponent } from '../facturacion/new-arfafe/arfafe-new.component';
import { DetailArfafeComponent } from '../facturacion/detail-arfafe/detail-arfafe.component';

const routes: Routes = [
  {
    path: 'pedido', component: PedidoComponent,
    children: [
          // { path: '', component: PedidoComponent },
          { path: 'nuevo', component: PedidoEdicionComponent },
          { path: 'edicion/:orden', component: PedidoEdicionComponent },
          { path: 'caja', component: CajaComponent },
          { path: 'arfafe' ,
            children: [
              { path: '', redirectTo: 'list', pathMatch: 'full' },
              { path:'list', component: ListArfafeComponent },
              { path:'new', component: NewArfafeComponent },
              { path:'detail', component: DetailArfafeComponent }
            ]
          }
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
