import { Catalogo } from './../models/Catalogo';
import { Usuario } from './../models/usuario';
import { HttpClient } from '@angular/common/http';
import { OtherService } from './other.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {

  constructor(private http:HttpClient, private url: OtherService) { }

  public getCatalogos(usuario:Usuario){
    return this.http.get<Catalogo[]>(this.url.getUrl()+`/catalogos/list/${usuario.cia}`);
  }
}
