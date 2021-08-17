import { CajaDTO } from './../DTO/CajaDTO';
import { IdArcaaccaj } from './../models/IdArcaaccaj';
import { DatosCajaDTO } from './../DTO/DatosCajaDTO';
import { Arcaaccaj } from './../models/Arcaaccaj';
import { HttpClient } from '@angular/common/http';
import { OtherService } from './other.service';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArcaaccajService {

  cajasCreadas = new Subject<Arcaaccaj[]>();
  mensajeCambio = new Subject<string>();

  constructor(private http: HttpClient, private url: OtherService) { }

  aperturaCaja(caja: Arcaaccaj) {
    return this.http.post<Arcaaccaj>(this.url.getUrl() + `/cajas`, caja);
  }
  actualizaCaja(caja: Arcaaccaj) {
    return this.http.put<Arcaaccaj>(this.url.getUrl() + `/cajas`, caja);
  }

  validaCaja(datos: DatosCajaDTO) {
    return this.http.post<Arcaaccaj>(this.url.getUrl() + `/cajas/valida/caja`, datos);
  }
  //=====================================
  caja(datos: DatosCajaDTO) {
    return this.http.post<Arcaaccaj[]>(this.url.getUrl() + `/cajas/caja`, datos);
  }
  totalCajas(datos: DatosCajaDTO) {
    return this.http.post<Arcaaccaj[]>(this.url.getUrl() + `/cajas/total`, datos);
  }
  eliminar(id: IdArcaaccaj){
    return this.http.post(this.url.getUrl() + `/cajas/eliminar`,id);
  }
  cajaSeleccianda(cia:string,centro:string){
    return this.http.get<CajaDTO[]>(this.url.getUrl()+`/cajas/seleccionada/${cia}/${centro}`);
  }
  cajaRegistro(cia:string,centro:string){
    return this.http.get<CajaDTO[]>(this.url.getUrl()+`/cajas/${cia}/${centro}`);
  }
}
