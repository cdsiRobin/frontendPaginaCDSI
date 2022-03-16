
import { TapUsuPven } from './../models/TapUsuPven';
import { OtherService } from './other.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TapusupvenService {

  constructor(private http:HttpClient, private url:OtherService) { }

  traerUsuario(cia:string,emp:string){
    return this.http.get<TapUsuPven>(this.url.getUrl()+`/usuarios/usuario/${cia}/${emp}`);
  }
  cajeros(cia:string,centro:string){
    return this.http.get<TapUsuPven[]>(this.url.getUrl()+`/usuarios/cajeros/${cia}/${centro}`);
  }

}
