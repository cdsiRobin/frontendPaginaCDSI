import { Arpffe } from './../models/arpffe';
import { Injectable } from '@angular/core';
import { GenericoService } from './generico/generico.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConsultaExitosa } from '../interfaces/consulta-exitosa';
import { map } from 'rxjs/operators';
import { Guardar } from '../interfaces/guardar';

@Injectable({
  providedIn: 'root'
})
export class ArpffeService extends GenericoService {

  constructor(private http: HttpClient) { super(); }

  // METODO QUE NOS PERMITE GUARDAR UNA GUIA DE REMISION INTERNA
  public guardar(arpffe: Arpffe): Observable<Arpffe>{
      const body = JSON.stringify(arpffe);
      return this.http.post<Guardar<Arpffe>>(this.url + `/arpffe/save`, body, this.options).pipe(
        map( (responde: Guardar<Arpffe>) => {
          return responde.detalle;
        })
      );
  }
  // FIN

  // METODOD QUE NOS PERMITE CONSULTAR UN GUIA REMISION
  public consultarGuia(cia: string, bodega: string, guia: string): Observable<Arpffe>{
     return this.http.get<ConsultaExitosa<Arpffe>>(this.url + `/arpffe/id?cia=${cia}&bodega=${bodega}&guia=${guia}`, this.options).pipe(
       map( (value: ConsultaExitosa<Arpffe>) => {
         return value.resultado;
       } )
     );
  }
  // FIN

}
