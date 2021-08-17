import { Linea } from './../models/Linea';
import { SubLinea } from './../models/SubLinea';
import { Usuario } from './../models/usuario';
import { OtherService } from './other.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SublineaService {

  constructor(private http:HttpClient, private url : OtherService) { }

  public getSubLineas(usuario:Usuario,cat:string,cla:string){
    return this.http.get<SubLinea[]>(this.url.getUrl()+`/sublineas/list/${usuario.cia}/${cat}/${cla}`);
  }
}
