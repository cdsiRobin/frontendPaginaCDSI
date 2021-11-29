import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "src/app/material/material.module";
import { ArfafeRoutingModule } from "./arfafe-routing.module";
import { ArfafeComponent } from "./arfafe.component";
import { ListArfafeComponent } from "./list-arfafe/list-arfafe.component";
import { NewArfafeComponent } from "./new-arfafe/arfafe-new.component";

@NgModule({
    imports: [
        ArfafeRoutingModule,
        MaterialModule,
        ReactiveFormsModule
        
    ],
    declarations: [
        ArfafeComponent,
        NewArfafeComponent,
        ListArfafeComponent
    ],
    exports: [],
    providers: []
})

export class ArfafeModule {
    constructor(){};
}