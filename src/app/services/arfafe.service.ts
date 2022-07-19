import { NotaCreditoDto } from './../models/nota-credito-dto';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ArfafeDTO } from '../DTO/arfafeDTO';
import { ConsultaExitosa } from '../interfaces/consulta-exitosa';
import { Arfafe } from '../models/Arfafe';
import {GenericoService} from './generico/generico.service';
import { Subject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ArfafeService extends GenericoService {

    private notaCreditoCambio = new Subject<NotaCreditoDto[]>();
    private mensajeCambio     = new Subject<string>();

    constructor(private http: HttpClient){ super(); }

    public getNotaCreditoCambio(){
      return this.notaCreditoCambio.asObservable();
    }

    public setNotaCreditoCambio(notaCreditoDtos: NotaCreditoDto[]){
       return this.notaCreditoCambio.next(notaCreditoDtos);
    }

    public getMensajeCambio(){
      return this.mensajeCambio.asObservable();
    }

    public setMensajeCambio(mensaje: string){
      return this.mensajeCambio.next(mensaje);
    }

    public listaNotasCredito(cia: string , doc: string, pven: string): Observable<NotaCreditoDto[]>{
      return this.http.get<ConsultaExitosa<NotaCreditoDto[]>>(this.url+`/arfafe/nc?cia=${cia}&doc=${doc}&pven=${pven}`, this.options).pipe(
        map( (reponse: ConsultaExitosa<NotaCreditoDto[]>) => {
          return reponse.resultado;
        } )
      );
    }

    addArfafe(data: Arfafe){
        const body = JSON.stringify(data);
        return this.http.post(this.url+`/arfafe/save`,body,this.options);
    }

    public arfafeDetalle(datos: ArfafeDTO) {
        const body = JSON.stringify(datos);
        return this.http.post<ConsultaExitosa<Arfafe>>(this.url + `/arfafe/id`, body, this.options)
        .pipe(map(data => {
            console.log(data.resultado.direccion);
            return data.resultado;
        }));
      }

    listaArfafe(cia: string, pven: string, doc: string, f1: string, f2: string, fac: string){
        return this.http.get<Arfafe[]>(this.url+`/arfafe/listas/${cia}/${pven}/${doc}?f1=${f1}&f2=${f2}&fac=${fac}`);
    }

    envioParaFE(cia: string, suc: string, tip: string, docu: string){
        return this.http.get<Arfafe[]>(this.url+`/fe?cia=${cia}&suc=${suc}&tip=${tip}&docu=${docu}`);
    }


}
