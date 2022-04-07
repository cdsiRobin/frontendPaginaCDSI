import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Infor } from "../interfaces/infor";
import { ArtstrdPVen } from "../models/ArtstrdPVen";
import { ArtstrdPVenPK } from "../models/ArtstrdPVenPK";
import { GenericoService } from "./generico/generico.service";

@Injectable({
    providedIn: 'root'
})
export class ArtstrdPVenService extends GenericoService {

    constructor(private http: HttpClient){ super(); }

    public save(data: ArtstrdPVen){
        const body = JSON.stringify(data);
        return this.http.post<Infor<ArtstrdPVen>>(this.url + `/ArtstrdPven/save`, body, this.options);
    }

    public find(datos: ArtstrdPVenPK) {
        const body = JSON.stringify(datos);
        return this.http.post(this.url+`/ArtstrdPven/search`,body,this.options);
      }

}