import { Arcaaccaj } from './../models/Arcaaccaj';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericoService } from './generico/generico.service';
import { ConsultaExitosas } from '../interfaces/consulta-exitosas';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Artsccb } from '../models/artsccb';
import { ConsultaExitosa } from '../interfaces/consulta-exitosa';
import { Guardar } from '../interfaces/guardar';

@Injectable({
  providedIn: 'root'
})
export class ArcaaccajService extends GenericoService {

  constructor(private http: HttpClient) { super(); }

  //METODO QUE NOS PERMITE SABER SI TIENE UNA CAJA ABIERTA
  public verificarCajaAbiertaCajero(cia: string, centro: string, cajera: string, estado: string, fecha: string): Observable< Array<Arcaaccaj> >{
    return this.http.get< ConsultaExitosas<Arcaaccaj> >(this.url+`/apercaja/vericaja?cia=${cia}&centro=${centro}&cajera=${cajera}&estado=${estado}&fecha=${fecha}`, this.options).pipe(
      map( (response: ConsultaExitosas<Arcaaccaj>) => {
        return response.resultado;
      } )
    );
  }
  //FIN

  // VERIFICAR QUE CAJA TIENE DISPONIBLE EL VENDEDOR
  public verificarCajaVendedor(cia: string, tipo: string, centro: string, responsable: string): Observable<Artsccb>{
    return this.http.get< ConsultaExitosa<Artsccb> >(this.url+`/artsccb?cia=${cia}&tipo=${tipo}&centro=${centro}&responsable=${responsable}`, this.options).pipe(
      map( (response: ConsultaExitosa<Artsccb>) => {
        return response.resultado;
      } )
    );
  }
  // FIN

  //METODO QUE NOS PERMITE GUARDAR O APERTURAR CAJA
  public aperturarCaja(arcaaccaj: Arcaaccaj): Observable<Arcaaccaj>{
    const body = JSON.stringify(arcaaccaj);
    // console.log(body);
    return this.http.post<Guardar<Arcaaccaj>>(this.url + `/apercaja`, body, this.options).pipe(
      map((responde: Guardar<Arcaaccaj>) => {
        return responde.detalle;
      })
    );
  }
  // fin


}
