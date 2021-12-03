import { Informacion } from './../interfaces/informacion';
import { Injectable } from '@angular/core';
import { GenericoService } from './generico/generico.service';
import { HttpClient } from '@angular/common/http';
import { BuscarItem } from '../models/buscar-item';
import { Observable, throwError } from 'rxjs';
import { Varinda1ps } from '../models/varinda1ps';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class Varinda1psService extends GenericoService {

  constructor(private http: HttpClient) { super(); }

  //PAGINADOR DE ITEM POR CIA, LISTA DE PRECIO DE 10 A 10
  public pageItemsCiaAndLpAndDescrip(buscarItem: BuscarItem): Observable<Informacion<Varinda1ps>> {
    return this.http.get<Informacion<Varinda1ps>>(this.url + `/vaps/buscar?cia=${buscarItem.cia}&desc=${buscarItem.descrip}&lp=${buscarItem.lp}`, this.options).pipe(
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
