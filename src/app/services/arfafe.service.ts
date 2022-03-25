import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ArfafeDTO } from '../DTO/arfafeDTO';
import { arfafeInterface } from '../interfaces/arfafeInterface';
import { Arfafe } from '../models/Arfafe';
import {GenericoService} from './generico/generico.service';

@Injectable({
    providedIn: 'root'
})
export class ArfafeService extends GenericoService {

    constructor(private http: HttpClient){ super(); }

    addArfafe(data: Arfafe){
        const body = JSON.stringify(data);
        return this.http.post(this.url+`/arfafe/save`,body,this.options);
    }

    public arfafeDetalle(datos: ArfafeDTO) {
        const body = JSON.stringify(datos);
        return this.http.post<arfafeInterface>(this.url + `/arfafe/id`, body, this.options);
      }

    listaArfafe(cia: string, pven: string, doc: string, f1: string, f2: string, fac: string){
        return this.http.get<Arfafe[]>(this.url+`/arfafe/listas/${cia}/${pven}/${doc}?f1=${f1}&f2=${f2}&fac=${fac}`);
    }
    
    envioParaFE(cia: string, suc: string, tip: string, docu: string){
        return this.http.get<Arfafe[]>(this.url+`/fe?cia=${cia}&suc=${suc}&tip=${tip}&docu=${docu}`);
    }
    

}
