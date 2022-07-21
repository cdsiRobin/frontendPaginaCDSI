import {PedidoComponent} from './pedido.component';
import {PedidoEdicionComponent} from './pedido-edicion/pedido-edicion.component';
import {CajaComponent} from './caja/caja.component';
import { RouterModule, Routes, CanActivate } from '@angular/router';
import { NgModule } from '@angular/core';
import { ListArfafeComponent } from '../facturacion/list-arfafe/list-arfafe.component';
import { NewArfafeComponent } from '../facturacion/new-arfafe/arfafe-new.component';
import { DetailArfafeComponent } from '../facturacion/detail-arfafe/detail-arfafe.component';
import { NewArcgtcComponent } from '../arcgtc/new-arcgtc/new-arcgtc.component';
import { ArccmcComponent } from '../arccmc/arccmc.component';
import { ArccvcComponent } from '../arccvc/arccvc.component';
import { ListapedComponent } from './listaped/listaped.component';
import { ArfamcComponent } from '../arfamc/arfamc.component';

import { ListancComponent } from '../notacredito/listanc/listanc.component';
import { ItemsncComponent } from '../notacredito/itemsnc/itemsnc.component';
import { SinitemncComponent } from '../notacredito/sinitemnc/sinitemnc.component';
import { ExitGuard } from '../../guards/exit.guard';

import { AuthGuard } from '../../guards/auth.guard';

const routes: Routes = [
  {
    path: 'pedido', component: PedidoComponent,
    canActivate: [AuthGuard],
    children: [
          // { path: '', component: PedidoComponent },
          { path: 'nuevo',
            canDeactivate: [ExitGuard],
            component: PedidoEdicionComponent },
          { path: 'lista', component: ListapedComponent },
          { path: 'empresa', component: ArfamcComponent },
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
          { path: 'notacredito' ,
            children: [
              { path: '', redirectTo: 'list', pathMatch: 'full' },
              { path:'list', component: ListancComponent },
              { path:'items',
                canDeactivate: [ExitGuard],
                component: ItemsncComponent },
              { path:'sinitem', component: SinitemncComponent }
            ]
          },
          { path: 'arfafe' ,
            children: [
              { path: '', redirectTo: 'list', pathMatch: 'full' },
              { path:'list', component: ListArfafeComponent },
              { path:'new',
                component: NewArfafeComponent },
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
