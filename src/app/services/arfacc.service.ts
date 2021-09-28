import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {OtherService} from './other.service';
import {Informacion} from '../interfaces/informacion';
import {Arfacc} from '../interfaces/Arfacc';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ArfaccService {

  constructor(
    private http: HttpClient,
    private url: OtherService
  ) { }

  // VAMOS A CONSULTAR EL CORRELATIVO
  public getSerieAndCorrelativoPedido(arfacc: Arfacc): Observable<Informacion>{
    return this.http.post<Informacion>(this.url.getUrl() + `/arfacc/id`, arfacc).pipe(
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
