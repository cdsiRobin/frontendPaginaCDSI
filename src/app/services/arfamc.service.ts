import { Injectable } from '@angular/core';
import { GenericoService } from './generico/generico.service';
import { HttpClient } from '@angular/common/http';
import { Arfamc } from '../models/arfamc';
import { Observable } from 'rxjs';
import { ConsultaExitosa } from '../interfaces/consulta-exitosa';
import { map } from 'rxjs/operators';
import { Actualizar } from '../interfaces/actualizar';

@Injectable({
  providedIn: 'root'
})
export class ArfamcService extends GenericoService {

  constructor(public http: HttpClient) { super(); }

   //BUSCAMOS POR CIA
  public buscarId(cia: string): Observable<Arfamc>{
    return this.http.get<ConsultaExitosa<Arfamc>>(this.url + `/company?cia=${cia}`, this.options).pipe(
      map( (reponse: ConsultaExitosa<Arfamc>) => {
        return reponse.resultado;
      } )
    );
  }
  // fin
  // ACTUALIZAR
  public update(arfamc: Arfamc): Observable<Arfamc>{
    const body = JSON.stringify(arfamc);
    return this.http.put<Actualizar<Arfamc>>(this.url + `/company`, body, this.options).pipe(
      map((value: Actualizar<Arfamc>) => {
        return value.estado.detalle;
      } )
    );
  }
  // FIN


}
