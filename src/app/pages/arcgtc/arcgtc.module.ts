import { ArcgtcComponent } from './arcgtc.component';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { ArcgtcRoutingModule } from './arcgtc-routing.module';
import { MaterialModule } from '../../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
      BrowserModule,
      CommonModule,
      FormsModule,
      ArcgtcRoutingModule,
      MaterialModule,
      ReactiveFormsModule
  ],
  declarations: [
      ArcgtcComponent
  ],
  exports: [],
  providers: [DatePipe]
})

export class ArcgtcModule { }
