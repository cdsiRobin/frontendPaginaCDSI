import { Injectable } from '@angular/core';
import {GenericoService} from './generico/generico.service';
import {HttpClient} from '@angular/common/http';
import {Arinme1} from '../models/arinme1';
import {Observable} from 'rxjs';
import {Guardar} from '../interfaces/guardar';
import {map} from 'rxjs/operators';
import { ComprabanteIngresodto } from '../DTO/comprabante-ingresodto';
import { ConsultaExitosas } from '../interfaces/consulta-exitosas';

@Injectable({
  providedIn: 'root'
})
export class Arinme1Service extends  GenericoService{

  constructor(private http: HttpClient) { super(); }
  // METODO QUE NOS PERMITE GUARDAR
  public guardar(arinme1: Arinme1): Observable<Arinme1>{
    const body = JSON.stringify(arinme1);
    return this.http.post<Guardar<Arinme1>>(this.url + `/arinme1/save`, body, this.options).pipe(
      map( (value: Guardar<Arinme1>) => {
        return value.detalle;
      } )
    );
  }
  // FIN
  public listaComprobanteIngreso(cia: string, noCli: string): Observable< Array<ComprabanteIngresodto> >{
    return this.http.get< ConsultaExitosas<ComprabanteIngresodto> >(this.url+`/arinme1/lcinc?cia=${cia}&noCli=${noCli}`, this.options).pipe(
      map( (response: ConsultaExitosas<ComprabanteIngresodto>) => {
        return response.resultado;
      } )
    );
  }

}
