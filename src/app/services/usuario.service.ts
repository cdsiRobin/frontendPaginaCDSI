import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OtherService } from './other.service';
import { Usuario } from '../models/usuario';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient, private other: OtherService) { }
  // METODO QUE NOS PERMITE GUARDAR UN USUARIO
  public saveUsuario(usuario: Usuario): Observable<any> {
    return this.http.post<any>(this.other.getUrl() + '/usu/save', usuario).pipe(
      catchError(e => {
        if (e.status == 400 || e.status == 500) {
          return throwError(e);
        }
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
        }
        return throwError(e);
      }) );
  }
  // VAMOS A TRAER LOS DATOS DE LA PAGINACION
  public getPageUsuario(usuario: Usuario, page: number): Observable<any> {
      return this.http.get(this.other.getUrl() + `/usu/list/page/${usuario.cia}/${page}`).pipe(
        map((response: any) => {
          (response.content as Usuario[]).map(usu => {
              usu.username = usu.username.toUpperCase();
              return usu;
          });
          return response;
        })
      );
    }

}
