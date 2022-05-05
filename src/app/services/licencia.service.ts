import { Injectable } from '@angular/core';
import { GenericoService } from './generico/generico.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Licencia } from '../models/licencia';
import { ConsultaExitosa } from '../interfaces/consulta-exitosa';
import { map } from 'rxjs/operators';
import { EstadoUpdate } from '../interfaces/estado-update';
import { Actualizar } from '../interfaces/actualizar';

@Injectable({
  providedIn: 'root'
})
export class LicenciaService extends GenericoService{

  constructor(private http: HttpClient) { super(); }
  // BUSCAMOS POR CIA
  public consultarCia(cia: string): Observable<Licencia>{
    return this.http.get<ConsultaExitosa<Licencia>>(this.url+`/licencia?cia=${cia}`, this.options).pipe(
      map( (response: ConsultaExitosa<Licencia>) => {
        return response.resultado;
      } )
    );
  }
  //FIN
  // BUSCAMOS POR ID
  public consultarId(cia: string, ruc: string): Observable<Licencia>{
    return this.http.get<ConsultaExitosa<Licencia>>(this.url+`/licencia/id?cia=${cia}&ruc=${ruc}`, this.options).pipe(
      map( (response: ConsultaExitosa<Licencia>) => {
        return response.resultado;
      } )
    );
  }
  //FIN

  public actualizar(cia: string, ruc: string, llave: string): Observable<Licencia>{
    return this.http.put<Actualizar<Licencia>>(this.url+`/licencia?cia=${cia}&ruc=${ruc}&llave=${llave}`, this.options).pipe(
      map( (response: Actualizar<Licencia>) => {
        return response.estado.detalle;
      } )
    );
  }


}
