import { DatosClienteDTO } from './../DTO/DatosClienteDTO';
import { Arccmc } from './../models/Arccmc';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {GenericoService} from './generico/generico.service';
import { Observable, throwError } from 'rxjs';
import { Informacion } from '../interfaces/informacion';
import { catchError } from 'rxjs/operators';

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
  public listaClientesRucLike( cia: string, id: string): Observable<Informacion<Arccmc>> {
    return this.http.get<Informacion<Arccmc>>(this.url + `cli/listRuc?cia=${cia}&id=${id}`, this.options).pipe(
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
