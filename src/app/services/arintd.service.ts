import { Injectable } from '@angular/core';
import { GenericoService } from './generico/generico.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Arintd } from '../models/arintd';
import { ConsultaExitosa } from '../interfaces/consulta-exitosa';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ArintdService extends GenericoService {

  constructor(private http: HttpClient) { super(); }

  //METODO QUE NOS PERMITE TRAER LOS DATOS DE LA TRANSACCION
  public findArintd(cia: string, trans: string): Observable<Arintd>{
     return this.http.get< ConsultaExitosa<Arintd> >(this.url + `/arintd/id?cia=${cia}&trans=${trans}`, this.options).pipe(
         map( (value: ConsultaExitosa<Arintd>) => {
           return value.resultado;
         } )
     );
  }

}
