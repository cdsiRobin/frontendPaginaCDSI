import { Injectable } from '@angular/core';
import { GenericoService } from './generico/generico.service';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Informacion } from '../interfaces/informacion';
import { Arcgmo } from '../models/arcgmo';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ArcgmoService extends GenericoService {

  constructor(public http: HttpClient) { super(); }

  //METODO QUE NOS TRAE LAS MONEDAS
  public listarArcgmo(): Observable<Informacion<Arcgmo>> {
     return this.http.get<Informacion<Arcgmo>>(this.url + `/arcgmo`, this.options).pipe(
      catchError(err => {
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
