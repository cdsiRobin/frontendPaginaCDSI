import { Injectable } from '@angular/core';
import { GenericoService } from './generico/generico.service';
import { HttpClient } from '@angular/common/http';
import { Arpfoe } from '../models/Arpfoe';
import { Observable } from 'rxjs';
import { Guardar } from '../interfaces/guardar';
import { map } from 'rxjs/operators';
import { Arccvc } from '../models/Arccvc';

@Injectable({
  providedIn: 'root'
})
export class ArpfoeService extends GenericoService {

  constructor(private http: HttpClient) { super(); }

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
