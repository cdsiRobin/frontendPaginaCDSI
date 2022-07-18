import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { ConsultaExitosas } from "../interfaces/consulta-exitosas";
import { Arcktb } from "../models/Arcktb";
import { GenericoService } from "./generico/generico.service";

@Injectable({
    providedIn : 'root'
})
export class ArcktbService extends GenericoService {

    constructor(private http: HttpClient){ super(); }

    listar(){
        return this.http.get<ConsultaExitosas<Arcktb>>(this.url+`/arcktb/list`)
        .pipe(map( result => {
            return result.resultado;
        }));
    }

}