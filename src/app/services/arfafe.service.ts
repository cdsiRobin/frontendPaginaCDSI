import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ArfafeDTO } from '../DTO/arfafeDTO';
import { arfafeInterface } from '../interfaces/arfafeInterface';
import { Informacion } from '../interfaces/informacion';
import { Arfafe } from '../models/Arfafe';
import {GenericoService} from './generico/generico.service';

@Injectable({
    providedIn: 'root'
})
export class ArfafeService extends GenericoService {

    constructor(private http: HttpClient){ super(); }

    public arfafeDetalle(datos: ArfafeDTO) {
        const body = JSON.stringify(datos);
        return this.http.post<arfafeInterface>(this.url + `/arfafe/id`, body, this.options);
      }

    listaArfafe(cia: string, doc: string){
        return this.http.get<Arfafe[]>(this.url+`/arfafe/listas/${cia}/${doc}`);
    }

}