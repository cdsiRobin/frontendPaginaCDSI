import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { MaterialModule } from "src/app/material/material.module";
import { ArfafeRoutingModule } from "./arfafe-routing.module";
import { ArfafeComponent } from "./arfafe.component";
import { DetailArfafeComponent } from "./detail-arfafe/detail-arfafe.component";
import { ListArfafeComponent } from "./list-arfafe/list-arfafe.component";
import { NewArfafeComponent } from "./new-arfafe/arfafe-new.component";

@NgModule({
    imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        ArfafeRoutingModule,
        MaterialModule,
        ReactiveFormsModule
        
    ],
    declarations: [
        ArfafeComponent,
        NewArfafeComponent,
        ListArfafeComponent,
        DetailArfafeComponent
    ],
    exports: [],
    providers: []
})

export class ArfafeModule {
    constructor(){};
}