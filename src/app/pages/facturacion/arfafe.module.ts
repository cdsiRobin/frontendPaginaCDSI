import { CommonModule, DatePipe } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { MaterialModule } from "src/app/material/material.module";
import { ArfafeRoutingModule } from "./arfafe-routing.module";
import { ArfafeComponent } from "./arfafe.component";
import { DetailArfafeComponent } from "./detail-arfafe/detail-arfafe.component";
import { ListArfafeComponent } from "./list-arfafe/list-arfafe.component";
import { NewArfafeComponent } from "./new-arfafe/arfafe-new.component";
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FlexLayoutModule } from "@angular/flex-layout";
import { ConfirmArfafeComponent } from "./confirm-arfafe/confirm-arfafe.component";

@NgModule({
    imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        ArfafeRoutingModule,
        MaterialModule,
        ReactiveFormsModule,
        MatSlideToggleModule,
        MatProgressSpinnerModule,
        FlexLayoutModule
    ],
    declarations: [
        ArfafeComponent,
        NewArfafeComponent,
        ListArfafeComponent,
        DetailArfafeComponent,
        ConfirmArfafeComponent
    ],
    exports: [],
    providers: [DatePipe]
})

export class ArfafeModule {
    constructor(){};
}
