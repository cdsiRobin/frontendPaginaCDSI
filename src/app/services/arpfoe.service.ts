import { Injectable } from '@angular/core';
import { GenericoService } from './generico/generico.service';
import { HttpClient } from '@angular/common/http';
import { Arpfoe } from '../models/Arpfoe';
import { Observable } from 'rxjs';
import { Guardar } from '../interfaces/guardar';
import { map } from 'rxjs/operators';

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
}
