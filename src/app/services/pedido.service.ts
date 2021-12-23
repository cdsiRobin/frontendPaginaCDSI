import { IArfacc } from '../interfaces/IArfacc';
import { CorrelDTO } from './../DTO/CorrelDTO';
import { Arpfol } from './../models/Arpfol';
import { PedidoDTO } from './../DTO/PedidoDTO';
import { HttpClient } from '@angular/common/http';
import { OtherService } from './other.service';
import { Arpfoe } from './../models/Arpfoe';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  pedidoCreado = new Subject<Arpfoe[]>();
  mensajeCambio = new Subject<string>();
  constructor(private http: HttpClient, private url: OtherService) { }

  registraPedido(pedido: PedidoDTO){
    return this.http.post(this.url.getUrl()+`/pedidos`,pedido);
  }
  traeCabecera(cia:string,orden:string){
    return this.http.get<Arpfoe>(this.url.getUrl()+`/pedidos/cabecera/${cia}/${orden}`);
  }
  listaPedidos(cia:string){
    return this.http.get<Arpfoe[]>(this.url.getUrl()+`/pedidos/${cia}`);
  }
  traeDetalle(cia:string,orden:string){
    return this.http.get<Arpfol[]>(this.url.getUrl()+`/pedidos/detalle/${cia}/${orden}`);
  }
  traePedido(cia:string,orden:string){
    return this.http.get<PedidoDTO[]>(this.url.getUrl()+`/pedidos/pedido/${cia}/${orden}`);
  }
  noOrdern(cia:string,centro:string){
    return this.http.get<string>(this.url.getUrl()+`/pedidos/orden/${cia}/${centro}`);
  }

}
