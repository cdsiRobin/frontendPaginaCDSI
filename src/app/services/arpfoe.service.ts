import { Injectable } from '@angular/core';
import { GenericoService } from './generico/generico.service';
import { HttpClient } from '@angular/common/http';
import { Arpfoe } from '../models/Arpfoe';
import { Observable } from 'rxjs';
import { Guardar } from '../interfaces/guardar';
import { map } from 'rxjs/operators';
import { Arccvc } from '../models/Arccvc';
import { ConsultaExitosas } from '../interfaces/consulta-exitosas';
import { ConsultaExitosa } from '../interfaces/consulta-exitosa';

@Injectable({
  providedIn: 'root'
})
export class ArpfoeService extends GenericoService {

  constructor(private http: HttpClient) { super(); }

  //LISTAMOS TODOS LOS PEDIDOS
  public listarPedidosPV(cia: string, indPv: string, fec1: string, fec2: string): Observable< Array<Arpfoe> >{
    return this.http.get<ConsultaExitosas<Arpfoe>>(this.url + `/arpfoe/pv?cia=${cia}&indPven=${indPv}&fec1=${fec1}&fec2=${fec2}`, this.options).pipe(
      map( (reponse: ConsultaExitosas<Arpfoe>) => {
        return reponse.resultado;
      } )
    );
  }
   //BUSCAMOS POR ID
  public buscarId(cia: string, cod: string): Observable<Arpfoe>{
    return this.http.get<ConsultaExitosa<Arpfoe>>(this.url + `/arpfoe/id?cia=${cia}&cod=${cod}`, this.options).pipe(
      map( (reponse: ConsultaExitosa<Arpfoe>) => {
        return reponse.resultado;
      } )
    );
  }

  // METODO PARA GUARDAR EL PEDDIO
  public savePedido(arpfoe: Arpfoe): Observable<Arpfoe>{
    const body = JSON.stringify(arpfoe);
    // console.log(body);
    return this.http.post<Guardar<Arpfoe>>(this.url + `/arpfoe/save`, body, this.options).pipe(
      map( (responde: Guardar<Arpfoe>) => {
        return responde.detalle;
      })
    );
  }
  // MODIFICAR
  modificarArccvc(arccvc: Arccvc){ //vendedores
    const body = JSON.stringify(arccvc);
    return this.http.put<Guardar<Arccvc>>(this.url + `/vendedores`, body, this.options).pipe(
      map( (responde: Guardar<Arccvc>) => {
        return responde.detalle;
      })
    );
  }
}
