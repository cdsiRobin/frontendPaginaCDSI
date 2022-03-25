import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Infor } from "../interfaces/infor";
import { Arfcree } from "../models/Arfcree";
import { ArfcreePK } from "../models/ArfcreePK";
import { GenericoService } from "./generico/generico.service";

@Injectable({
    providedIn: 'root'
})
export class ArfcreeService extends GenericoService {

    constructor(private http: HttpClient){
        super();
    }

    createArfcree(data: Arfcree){
        const body = JSON.stringify(data);
        return this.http.post(this.url+`/arfcree/save`,body,this.options);
    }

    findArfcree(data: ArfcreePK){
        const body = JSON.stringify(data);
        return this.http.post<Infor<Arfcree>>(this.url+`/arfcree/id`,this.options);
    }

}