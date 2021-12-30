import { IArfacc } from '../interfaces/IArfacc';
import { CorrelDTO } from './../DTO/CorrelDTO';
import { Arpfol } from './../models/Arpfol';
import { PedidoDTO } from './../DTO/PedidoDTO';
import { HttpClient } from '@angular/common/http';
import { OtherService } from './other.service';
import { Arpfoe } from './../models/Arpfoe';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IdArpfoe } from '../models/IdArpfoe';
import { GenericoService } from './generico/generico.service';
import { Infor } from '../interfaces/infor';

@Injectable({
  providedIn: 'root'
})
export class PedidoService extends GenericoService {

  pedidoCreado = new Subject<Arpfoe[]>();
  mensajeCambio = new Subject<string>();
  constructor(public http: HttpClient) { super(); }

  pedidoParaFactura(datos: IdArpfoe){
    const body = JSON.stringify(datos);
    return this.http.post<Infor<Arpfoe>>(this.url+`/arpfoe/id`,body, this.options);
  }

  registraPedido(pedido: PedidoDTO){
    return this.http.post(this.url+`/pedidos`,pedido);
  }
  traeCabecera(cia:string,orden:string){
    return this.http.get<Arpfoe>(this.url+`/pedidos/cabecera/${cia}/${orden}`);
  }
  listaPedidos(cia:string){
    return this.http.get<Arpfoe[]>(this.url+`/pedidos/${cia}`);
  }
  traeDetalle(cia:string,orden:string){
    return this.http.get<Arpfol[]>(this.url+`/pedidos/detalle/${cia}/${orden}`);
  }
  traePedido(cia:string,orden:string){
    return this.http.get<PedidoDTO[]>(this.url+`/pedidos/pedido/${cia}/${orden}`);
  }
  noOrdern(cia:string,centro:string){
    return this.http.get<string>(this.url+`/pedidos/orden/${cia}/${centro}`);
  }

}
