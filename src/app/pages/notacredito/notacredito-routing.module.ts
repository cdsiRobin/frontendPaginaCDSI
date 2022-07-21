import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ListancComponent } from './listanc/listanc.component';
import { ItemsncComponent } from './itemsnc/itemsnc.component';
import { SinitemncComponent } from './sinitemnc/sinitemnc.component';
import { ExitGuard } from '../../guards/exit.guard';

const routes: Routes = [
  { path: 'notacredito', component: ListancComponent, children:
    [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path:'items',
        canDeactivate: [ExitGuard],
        component: ItemsncComponent },
      { path:'sinitem', component: SinitemncComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotacreditoRoutingModule { }
