import { MaterialModule } from './material/material.module';
import { TokenInterceptor } from './interceptor/TokenInterceptor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { ComponentsModule } from './components/components.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
//MODULOS
import { AppRoutingModule } from './app-routing.module';
import { PagesModule } from './pages/pages.module';

import { AppComponent } from './app.component';
import { NopagefoundComponent } from './nopagefound/nopagefound.component';

//ANGULAR MATERIA



@NgModule({
  declarations: [
    AppComponent,
    NopagefoundComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PagesModule,
    ComponentsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
