import { Injectable } from '@angular/core';
import { GenericoService } from './generico/generico.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuac } from '../models/usuac';
import { ConsultaExitosas } from '../interfaces/consulta-exitosas';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuacService extends GenericoService {

  constructor(private http: HttpClient) { super(); }

  //LISTAMOS TODOS LOS USUARIOS ACTIVO DE LA EMPRESA
  private listarUsuariosActivos(cia: string, activo: string): Observable<Array<Usuac>>{
    return this.http.get< ConsultaExitosas<Usuac> >(this.url+`/usuac/activo?cia=${cia}&activo=${activo}`, this.options).pipe(
      map( (response: ConsultaExitosas<Usuac>) => {
        return response.resultado;
      } )
    );
  }
  //FIN
}
