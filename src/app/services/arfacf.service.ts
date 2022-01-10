import { Injectable } from '@angular/core';
import { GenericoService } from './generico/generico.service';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Informacion } from '../interfaces/informacion';
import { catchError } from 'rxjs/operators';
import { ArfacfPK } from '../models/arfacfPK';
import { Arfacf } from '../models/Arfacf';
import { Infor } from '../interfaces/infor';

@Injectable({
  providedIn: 'root'
})
export class ArfacfService extends GenericoService{

  constructor(public http: HttpClient) { super();}

  public buscarCentro(cia: string, centro: string): Observable<Infor<Arfacf>>{
    var arfacfPK: ArfacfPK = new ArfacfPK();
    arfacfPK.noCia = cia;
    arfacfPK.centro = centro;
    const body = JSON.stringify(arfacfPK);
     return this.http.post<Infor<Arfacf>>(this.url + `/arfacf/id`,body, this.options).pipe(catchError(err => {
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

}
