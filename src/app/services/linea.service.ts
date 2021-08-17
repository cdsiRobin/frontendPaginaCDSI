import { IdCatalogo } from './../models/idCatalogo';
import { Linea } from './../models/Linea';
import { Usuario } from './../models/usuario';
import { OtherService } from './other.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LineaService {

  constructor(private http:HttpClient, private url:OtherService) { }

  public getLineas(usuario:Usuario,id:string){
    return this.http.get<Linea[]>(this.url.getUrl()+`/lineas/list/${usuario.cia}/${id}`);
  }
}
