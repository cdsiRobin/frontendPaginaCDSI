import { Injectable } from '@angular/core';
import { GenericoService } from './generico/generico.service';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Informacion } from '../interfaces/informacion';
import { catchError } from 'rxjs/operators';
import { Arfafp } from '../models/Arfafp';
import { ArfafpPK } from '../models/ArfafpPK';

@Injectable({
  providedIn: 'root'
})
export class ArfafpService extends GenericoService{

  constructor(public http: HttpClient) { super();}

  public listarFPFactu(cia: string, estado: string): Observable<Informacion<Arfafp>>{
    let arfafp:Arfafp = new Arfafp();
    arfafp.arfafpPK = new ArfafpPK();
    arfafp.arfafpPK.noCia = cia;
    arfafp.estado = estado;
    const body = JSON.stringify(arfafp);
     return this.http.post<Informacion<Arfafp>>(this.url + `/fpago/`,body, this.options).pipe(catchError(err => {
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
