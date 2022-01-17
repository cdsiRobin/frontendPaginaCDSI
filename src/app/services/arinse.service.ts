import { Injectable } from '@angular/core';
import { GenericoService } from './generico/generico.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Arinse } from '../models/arinse';
import { ConsultaExitosa } from '../interfaces/consulta-exitosa';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ArinseService extends GenericoService {

  constructor( private http: HttpClient) { super(); }

  //METODOD QUE NOS TRAE EL NO_DUCO DE LA TRANSACCION , BODEGA Y CIA
  public getArinse(cia: string, bodega: string, trans: string): Observable<Arinse>{
     return this.http.get<ConsultaExitosa<Arinse>>(this.url + `/arinse/id?cia=${cia}&bodega=${bodega}&tran=${trans}`, this.options).pipe(
       map( (value: ConsultaExitosa<Arinse>) => {
         return value.resultado;
       } )
     );
  }
  //FIN
}
