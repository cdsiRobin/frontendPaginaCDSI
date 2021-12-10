import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

import { Informacion } from '../interfaces/informacion';

import {Observable, throwError} from 'rxjs';
import { map } from 'rxjs/operators';
import {Arfacc} from '../models/arfacc';
import {GenericoService} from './generico/generico.service';

@Injectable({
  providedIn: 'root'
})
export class ArfaccService extends GenericoService{

  constructor(
    private http: HttpClient
  ) { super(); }

  // VAMOS A CONSULTAR LA SERIE Y CORRELATIVO
  /*
  public getSerieAndCorrelativoPedido(arfacc: Arfacc): Observable<Informacion<Arfacc>>{
    const body = JSON.stringify(arfacc);
    return this.http.post<Informacion<Arfacc>>(this.url + `/arfacc/id`, body, this.options).pipe(
          map( (response: Informacion<Arfacc>) =>{

          })
    );
  }
  */
  // VAMOS A CONSULTAR LA SERIE Y CORRELATIVO
  public getSerieAndCorrelativoPedido(arfacc: Arfacc): Observable<Arfacc[]>{
    const body = JSON.stringify(arfacc);
    return this.http.post<Informacion<Arfacc>>(this.url + `/arfacc/id`, body, this.options).pipe(
          map( (response: Informacion<Arfacc>) =>{
                return response.resultado.map( (v: Arfacc) => {
                    v.consDesde = v.consDesde +1;
                    return v;
                } )
          })
    );
  }

}
