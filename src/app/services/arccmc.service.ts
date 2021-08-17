import { DatosClienteDTO } from './../DTO/DatosClienteDTO';
import { Arccmc } from './../models/Arccmc';
import { HttpClient } from '@angular/common/http';
import { OtherService } from './other.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ArccmcService {

  constructor(private http: HttpClient, private url: OtherService) { }

  listaClientes(datos:DatosClienteDTO) {
    return this.http.post<Arccmc[]>(this.url.getUrl() + `/cli/list`,datos);
  }
  totalClientes(cia:string) {
    return this.http.get<Arccmc[]>(this.url.getUrl() + `/cli/list/${cia}`);
  }
  traeCliente(datos:DatosClienteDTO){
    return this.http.post<Arccmc>(this.url.getUrl() + `/cli/cliente`,datos);
  }
}
