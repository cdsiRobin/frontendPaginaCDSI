import { Injectable } from '@angular/core';
import { OtherService } from './other.service';
import { Observable, throwError } from 'rxjs';
import { Gelocation } from '../models/gelocation';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class GelocationService {

  constructor(private http: HttpClient, private other: OtherService) { }
  // OBTENER LOS DATOS DE LA GELOCATION
  public getGelocation(usuario: Usuario): Observable<any> {
    return this.http.get<any>(this.other.getUrl() + `/gelo/get/${usuario.cia}/${usuario.username}`).pipe(
      map((rest: any) => rest as Gelocation ) );
  }
  // VAMOS ACTUALIZAR LA GEOLOCALIZACIÓN DE UN USUARIO
  public update(gelocation: Gelocation): Observable<any> {
    return this.http.put<any>(`${this.other.getUrl()}/gelo/update/${gelocation.id}`, gelocation).pipe(
      catchError(e => {
        if (e.status == 400 || e.status == 500) {
          return throwError(e);
        }
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
        }
        return throwError(e);
      }));
  }
}
