import { ArcgtcComponent } from './arcgtc.component';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { ArcgtcRoutingModule } from './arcgtc-routing.module';
import { MaterialModule } from '../../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewArcgtcComponent } from './new-arcgtc/new-arcgtc.component';
import { MatNativeDateModule } from '@angular/material/core';

@NgModule({
  declarations: [
    ArcgtcComponent,
    NewArcgtcComponent
  ],
  imports: [
      BrowserModule,
      CommonModule,
      FormsModule,
      MatNativeDateModule,
      ArcgtcRoutingModule,
      MaterialModule,
      ReactiveFormsModule
  ],
  exports: [],
  providers: [DatePipe]
})

export class ArcgtcModule { }
