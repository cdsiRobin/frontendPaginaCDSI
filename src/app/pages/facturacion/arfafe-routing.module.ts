import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ArfafeComponent } from "./arfafe.component";
import { DetailArfafeComponent } from "./detail-arfafe/detail-arfafe.component";
import { ListArfafeComponent } from "./list-arfafe/list-arfafe.component";
import { NewArfafeComponent } from "./new-arfafe/arfafe-new.component";

const routes: Routes = [
    { path: 'arfafe', component: ArfafeComponent, children: [
        { path: '', redirectTo: 'list', pathMatch: 'full' },
        { path:'list', component: ListArfafeComponent },
        { path:'new', component: NewArfafeComponent },
        { path:'detail', component: DetailArfafeComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ArfafeRoutingModule {}