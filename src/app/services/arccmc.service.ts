import { DatosClienteDTO } from './../DTO/DatosClienteDTO';
import { Arccmc } from './../models/Arccmc';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {GenericoService} from './generico/generico.service';
import { Observable, throwError } from 'rxjs';
import { Informacion } from '../interfaces/informacion';
import { catchError, map } from 'rxjs/operators';
import { Empresa } from '../models/empresa';
import { ConsultaExitosa } from '../interfaces/consulta-exitosa';
import { Persona } from '../models/persona';

@Injectable({
  providedIn: 'root'
})
export class ArccmcService extends GenericoService{

  constructor(private http: HttpClient) { super(); }

  //CONSULTAR POR RUC DESDE API DE SUNAT
  public buscarClienteRUCApiSunat(ruc: string): Observable<Empresa>{
    return this.http.get< ConsultaExitosa<Empresa> >(this.url+`/cli/buscarapi?id=${ruc}`,this.options).pipe(
      map( (response : ConsultaExitosa<Empresa>) =>{
        return response.resultado;
      } )
    );
  }

  //CONSULTAR POR DNI DESDE API DE SUNAT
  public buscarClienteDNIApiSunat(dni: string): Observable<Persona>{
    return this.http.get< ConsultaExitosa<Persona> >(this.url+`/cli/buscarapi?id=${dni}`,this.options).pipe(
      map( (response : ConsultaExitosa<Persona>) =>{
        return response.resultado;
      } )
    );
  }

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
  public listaClientesRucLike( cia: string, id: string): Observable<Informacion<Arccmc>> {
    return this.http.get<Informacion<Arccmc>>(this.url + `/cli/listRuc?cia=${cia}&id=${id}`, this.options).pipe(
      catchError(err => {
        if (err.status === 400 || err.status === 500) {
          console.error(err.erro.message);
          return throwError(err);
        }
        if (err.error.mensaje) {
          console.error(err.error.message);
        }
        return  throwError(err);
      })
    );
  }
  /*
  public listaClientesRucLike( cia: string, id: string){
    return this.http.get<Arccmc[]>(this.url + `/cli/listRuc/${cia}/${id}`)
  }
  */
}
