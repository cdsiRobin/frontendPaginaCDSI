import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { BrowserModule } from "@angular/platform-browser";
import { MatFileUploadModule } from "angular-material-fileupload";
import { MaterialModule } from "src/app/material/material.module";
import { ItemRoutingModule } from "./item-routing.module";
import { ItemComponent } from "./item.component";
import { NewItemComponent } from "./items-new/items-new.component";

@NgModule({
    imports: [
        ItemRoutingModule,
        BrowserModule,
        CommonModule,
        FormsModule,
        MaterialModule,
        ReactiveFormsModule,
        MatSlideToggleModule,
        MatProgressSpinnerModule,
        MatFileUploadModule
    ],
    declarations: [
        ItemComponent,
        NewItemComponent
    ],
    exports: [],
    providers: []
})

export class ItemModule {
    constructor(){};
}
