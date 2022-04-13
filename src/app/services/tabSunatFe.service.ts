import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { ConsultaExitosas } from "../interfaces/consulta-exitosas";
import { TabSunatFe } from "../models/TabSunatFe";
import { GenericoService } from "./generico/generico.service";

@Injectable({
    providedIn: 'root'
})
export class TabSunatFeService extends GenericoService {

    constructor(private http: HttpClient){ super(); }

    public listar(clase: string){
        return this.http.get<ConsultaExitosas<TabSunatFe>>(this.url+
            `/TabSunatFe//list?clase=${clase}`,this.options)
        .pipe(map( result => {
            return result.resultado;
        }));
    }

}