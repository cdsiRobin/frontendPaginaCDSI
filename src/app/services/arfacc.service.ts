import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {OtherService} from './other.service';
import {Informacion} from '../interfaces/informacion';
import {IArfacc} from '../interfaces/IArfacc';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Arfacc} from '../models/arfacc';
import {IarfaccPK} from '../interfaces/IarfaccPK';

@Injectable({
  providedIn: 'root'
})
export class ArfaccService {

  constructor(
    private http: HttpClient,
    private url: OtherService
  ) { }

  // VAMOS A CONSULTAR EL CORRELATIVO
  public getSerieAndCorrelativoPedido(arfacc: Arfacc): Observable< Informacion<IArfacc> >{
    return this.http.post<Informacion<IArfacc>>(this.url.getUrl() + `/arfacc/id`, arfacc).pipe(
      catchError(err => {
        if (err.status === 400 || err.status === 500){
          console.error(err);
          return throwError(err);
        }
        if (err.error.mensaje) {
          console.error(err.error.mensaje);
        }
        return  throwError(err);
      })
    );
  }

}
