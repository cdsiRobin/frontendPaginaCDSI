import { Injectable } from '@angular/core';
import { GenericoService } from './generico/generico.service';
import { HttpClient } from '@angular/common/http';
import { Arfacfpk } from '../models/arfacfpk';
import { Observable } from 'rxjs';
import { Arfacf } from '../models/arfacf';
import { ConsultaExitosa } from '../interfaces/consulta-exitosa';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ArfacfService extends GenericoService {

  constructor(private http: HttpClient) { super(); }

  //METODOD QUE NOS PERMITE OBTENER LOS DATOS DEL CENTRO EMISOR PARA SABER SI PUEDE EMITIR GUIA INTERNA
  public getArfacf(arfacfpk: Arfacfpk): Observable<Arfacf>{
    const body = JSON.stringify(arfacfpk);
    return this.http.post< ConsultaExitosa<Arfacf> >(this.url + `/arfacf/id`, body, this.options).pipe(
      map( (value: ConsultaExitosa<Arfacf>) => {
        return value.resultado;
      } )
    );
  }
  //FIN

}
