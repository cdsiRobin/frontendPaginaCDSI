import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {GenericoService} from './generico/generico.service';
import {ITransaccion} from '../interfaces/ITransaccion';
import {Observable, throwError} from 'rxjs';
import {Informacion} from '../interfaces/informacion';
import {catchError} from 'rxjs/operators';
import {Arfacc} from '../models/arfacc';

@Injectable({
  providedIn: 'root'
})
export class TransaccionService extends GenericoService{

  constructor(private http: HttpClient) {
    super();
  }
  // METODO QUE NOS PERMITE TRAER LA TRANSACCION POR USUARIO
  public listarTransacconPorUsuario(cia: string, user: string): Observable<Informacion<ITransaccion>>{
    return this.http.get<Informacion<ITransaccion>>(this.url + `/trans/${cia}/${user}`, this.options).pipe(
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
