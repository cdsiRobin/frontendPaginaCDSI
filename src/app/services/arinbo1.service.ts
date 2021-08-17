import { Usuario } from './../models/usuario';
import { Arinbo1 } from './../models/Arinbo1';
import { OtherService } from './other.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Arinbo1Service {

  constructor(private http:HttpClient, private url: OtherService) { }

  public getAlmacenes(usuario:Usuario){
    return this.http.get<Arinbo1[]>(this.url.getUrl()+`/almacenes/list/${usuario.cia}`);
  }
}
