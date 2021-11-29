import { Injectable } from '@angular/core';
import { GenericoService } from './generico/generico.service';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Informacion } from '../interfaces/informacion';
import { catchError } from 'rxjs/operators';
import { Tapfopa } from '../models/tapfopa';

@Injectable({
  providedIn: 'root'
})
export class TapfopaService extends GenericoService{

  constructor(public http: HttpClient) { super();}

  //METODO QUE NOS PERMITE TRAER LAS FORMAS DE PAGO CON ESTADO A
  public listarFormaPagoCiaAndEstado(cia: string, estado: string): Observable<Informacion<Tapfopa>>{
     return this.http.get<Informacion<Tapfopa>>(this.url + `/tapfopa?cia=${cia}&estado=${estado}`, this.options).pipe(catchError(err => {
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
