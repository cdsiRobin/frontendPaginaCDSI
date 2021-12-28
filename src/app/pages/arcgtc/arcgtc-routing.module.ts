import { ArcgtcComponent } from './arcgtc.component';
import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'arcgtc', component: ArcgtcComponent, children: [
      { path: '', redirectTo: 'new', pathMatch: 'full' }/*,
      { path:'list', component: ListArfafeComponent },
      { path:'new', component: NewArfafeComponent },
      { path:'detail', component: DetailArfafeComponent }*/
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ArcgtcRoutingModule { }
