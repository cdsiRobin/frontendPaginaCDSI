import { DatosClienteDTO } from './../DTO/DatosClienteDTO';
import { Arccmc } from './../models/Arccmc';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {GenericoService} from './generico/generico.service';

@Injectable({
  providedIn: 'root'
})
export class ArccmcService extends GenericoService{

  constructor(private http: HttpClient) { super(); }

 public listaClientes(datos: DatosClienteDTO) {
    const body = JSON.stringify(datos);
    return this.http.post<Arccmc[]>(this.url + `/cli/list`, body, this.options);
  }
 public totalClientes(cia: string) {
    return this.http.get<Arccmc[]>(this.url + `/cli/list/${cia}`, this.options);
  }
 public traeCliente(datos: DatosClienteDTO){
    const body = JSON.stringify(datos);
    return this.http.post<Arccmc>(this.url + `/cli/cliente`, body, this.options);
  }
  // LISTA DE CLIENTES POR RUC LIKE
  public listaClientesRucLike( cia: string, id: string){
    return this.http.get<Arccmc[]>(this.url + `/cli/listRuc/${cia}/${id}`)
  }
}
