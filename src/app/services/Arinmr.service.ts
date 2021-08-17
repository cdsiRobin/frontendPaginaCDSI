import { Arinmr } from './../models/Arinmr';
import { Usuario } from './../models/usuario';
import { OtherService } from './other.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ArinmrService {

  constructor(private http:HttpClient, private url: OtherService) { }

  public getMarcas(usuario:Usuario){
    return this.http.get<Arinmr[]>(this.url.getUrl()+`/marcas/list/${usuario.cia}`);
  }
}
