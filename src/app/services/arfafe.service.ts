import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Arfafe } from '../models/Arfafe';
import { OtherService } from './other.service';

@Injectable({
    providedIn: 'root'
})
export class ArfafeService {

    constructor(private http: HttpClient, private url: OtherService){}

    listaArfafe(cia: string){
        return this.http.get<Arfafe[]>(this.url.getUrl()+`/arfafe/listas/${cia}`);
    }

}