import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { ConsultaExitosas } from "../interfaces/consulta-exitosas";
import { Infor } from "../interfaces/infor";
import { Informacion } from "../interfaces/informacion";
import { Artsopp } from "../models/Artsopp";
import { ArtstrdPVen } from "../models/ArtstrdPVen";
import { ArtstrdPVenPK } from "../models/ArtstrdPVenPK";
import { Artsttropi } from "../models/Artsttropi";
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

    public listArtsopp(cia: string){
        return this.http.get<ConsultaExitosas<Artsopp>>(this.url+`/ArtstrdPven/artsopp?cia=${cia}`,this.options)
        .pipe(map( result => {
            return result.resultado;
        }));
    }

    public listArtsttropi(cia :string){
        return this.http.get<Informacion<Artsttropi>>(this.url+`/ArtstrdPven/Artsttropi?cia=${cia}`,this.options)
        .pipe(map( (result: Informacion<Artsttropi>) => {
            return result.resultado;
        }));
    }

}