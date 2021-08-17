import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Astenci } from '../models/astenci';
import { OtherService } from './other.service';
import { Usuario } from '../models/usuario';
import { Rgtacde } from '../models/rgtacde';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {

  constructor(private http: HttpClient, public other: OtherService) { }

  // vamos a traer las asistencias sin registrar
    // VAMOS A TRAER LOS REGISTRO DE HOY
    public asistenciaSinRegistrar(usuario: Usuario) {
      // return this.http.get<Astenci[]>(this.other.getUrl() + `/asten/asHoy/${usuario.cia}/${usuario.username}`);

      return this.http.get<Astenci[]>(this.other.getUrl() + `/asten/asHoy/${usuario.cia}/${usuario.username}`).pipe(
         map(rest => {
           return rest;
         })
       );

    }
    // METODO QUE NOS PERMITE GUARDAR UN RGTACDE
    public saveRgtacde(rgtacde: Rgtacde) {
      const authData = {
        ...rgtacde
      };
      return this.http.post(this.other.getUrl() + '/rgta/save', authData);
    }
}

