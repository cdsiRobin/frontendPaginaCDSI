import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ItemComponent } from "./item.component";
import { NewItemComponent } from "./items-new/items-new.component";

const routes: Routes = [
    { path: 'item', component: ItemComponent, children: [
         { path: '', redirectTo: 'new', pathMatch: 'full' },
         { path:'new', component: NewItemComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ItemRoutingModule {}