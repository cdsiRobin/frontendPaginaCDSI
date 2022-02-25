import { Injectable } from '@angular/core';
import { GenericoService } from './generico/generico.service';
import { HttpClient } from '@angular/common/http';
import { Arinum } from '../models/arinum';
import { Observable } from 'rxjs';
import { ConsultaExitosas } from '../interfaces/consulta-exitosas';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ArinumService extends GenericoService {

  constructor(private http: HttpClient) { super(); }

  //LISTAMOS LAS UNIDADES CON ESTADO ACTIVO
  public listarDepartXcia(cia: string): Observable< Array<Arinum> > {
    return this.http.get<ConsultaExitosas<Arinum>>(this.url + `/arinum?cia=${cia}&estado=A`, this.options).pipe(
      map( (reponse: ConsultaExitosas<Arinum>) => {
        return reponse.resultado;
      } )
    );
  }

}
