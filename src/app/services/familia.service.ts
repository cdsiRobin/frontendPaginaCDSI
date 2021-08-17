import { Familia } from './../models/Familia';
import { Usuario } from './../models/usuario';
import { OtherService } from './other.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FamiliaService {

  constructor(private http : HttpClient, private url : OtherService) { }

  public getFamilias(usuario:Usuario,cat:string,cla:string,cate:string){
    return this.http.get<Familia[]>(this.url.getUrl()+`/familias/list/${usuario.cia}/${cat}/${cla}/${cate}`);
  }
}
