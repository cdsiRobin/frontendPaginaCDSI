import { Usuario } from './../models/usuario';
import { Arfatp } from './../models/Arfatp';
import { OtherService } from './other.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ArfatpService {

  constructor(private http:HttpClient, private url: OtherService) { }

  public getPrecios(usuario:Usuario){
    return this.http.get<Arfatp[]>(this.url.getUrl()+`/listaprecios/list/${usuario.cia}`);
  }
}
