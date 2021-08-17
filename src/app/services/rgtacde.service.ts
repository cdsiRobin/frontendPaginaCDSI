import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OtherService } from './other.service';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { Rgtacde } from '../models/rgtacde';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class RgtacdeService {

  constructor(private http: HttpClient, private other: OtherService) { }

  // VAMOS A TRAER LOS DATOS DE LA PAGINACION
  public getPageRgtacde(ususario: Usuario, page: number): Observable<any> {
    return this.http.get(this.other.getUrl() + `/rgta/list/page/${ususario.cia}/${page}`).pipe(
      tap((rest: any) => {
          (rest.content as Rgtacde[]).forEach(rgtacde => {
           // console.log(rgtacde);
          });
      }),
      map((response: any) => {
        (response.content as Rgtacde[]).map(rgtacde => {
            rgtacde.usuario = rgtacde.usuario.toUpperCase();
            return rgtacde;
        });
        return response;
      }),
      tap(resp => {
        console.log('RgtacdeService: tap 2');
      })
    );
  }
}
