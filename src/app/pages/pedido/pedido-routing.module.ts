import {PedidoComponent} from './pedido.component';
import {PedidoEdicionComponent} from './pedido-edicion/pedido-edicion.component';
import {CajaComponent} from './caja/caja.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ListArfafeComponent } from '../facturacion/list-arfafe/list-arfafe.component';
import { NewArfafeComponent } from '../facturacion/new-arfafe/arfafe-new.component';
import { DetailArfafeComponent } from '../facturacion/detail-arfafe/detail-arfafe.component';
import { NewArcgtcComponent } from '../arcgtc/new-arcgtc/new-arcgtc.component';
import { ArccmcComponent } from '../arccmc/arccmc.component';
import { ArccvcComponent } from '../arccvc/arccvc.component';

const routes: Routes = [
  {
    path: 'pedido', component: PedidoComponent,
    children: [
          // { path: '', component: PedidoComponent },
          { path: 'nuevo', component: PedidoEdicionComponent },
          { path: 'arcgtc' ,
            children: [
              { path: '', redirectTo: 'new', pathMatch: 'full' },
              { path:'new', component: NewArcgtcComponent },
            ]
          },
          { path: 'arccmc' ,
            children: [
              { path: '', redirectTo: 'new', pathMatch: 'full' },
              { path:'new', component: ArccmcComponent },
            ]
          },
          { path: 'edicion/:orden', component: PedidoEdicionComponent },
          { path: 'caja', component: CajaComponent },
          { path: 'perfil', component: ArccvcComponent },
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
