import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { ConsultaExitosas } from "../interfaces/consulta-exitosas";
import { Artstar } from "../models/Artstar";
import { GenericoService } from "./generico/generico.service";

@Injectable({
    providedIn: 'root'
})
export class ArtstarService extends GenericoService {

    constructor(private http: HttpClient){ super(); }

    public listar(cia:string){
        return this.http.get<ConsultaExitosas<Artstar>>(this.url+`/artstar/list?cia=${cia}`)
        .pipe(map( result => {
            return result.resultado;
        }));
    }

}