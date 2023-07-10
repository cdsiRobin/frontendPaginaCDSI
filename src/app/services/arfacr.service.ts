import { Injectable } from '@angular/core';
import { GenericoService } from './generico/generico.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConceptoDto } from '../DTO/concepto-dto';
import { ConsultaExitosas } from '../interfaces/consulta-exitosas';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ArfacrService extends GenericoService {

  constructor(private http: HttpClient) { super(); }

  public listaConcepto(cia: string, indDet: string): Observable< Array<ConceptoDto> >{
    return this.http.get< ConsultaExitosas<ConceptoDto> >(this.url+`/arfacr/dto/lista?cia=${cia}&indDet=${indDet}`, this.options).pipe(
      map( (response: ConsultaExitosas<ConceptoDto>) => {
        return response.resultado;
      } )
    );
  }

}
