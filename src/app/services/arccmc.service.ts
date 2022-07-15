import { DatosClienteDTO } from './../DTO/DatosClienteDTO';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {GenericoService} from './generico/generico.service';
import { Observable, throwError } from 'rxjs';
import { Informacion } from '../interfaces/informacion';
import { catchError, map } from 'rxjs/operators';
import { Empresa } from '../models/empresa';
import { ConsultaExitosa } from '../interfaces/consulta-exitosa';
import { Persona } from '../models/persona';
import { Arccdp } from '../models/arccdp';
import { ConsultaExitosas } from '../interfaces/consulta-exitosas';
import { Arccpr } from '../models/arccpr';
import { Arccdi } from '../models/arccdi';
import { Arccmc } from '../models/Arccmc';
import { Guardar } from '../interfaces/guardar';
import { Arccmcdto } from '../models/arccmcdto';
import { DirecLegal } from '../DTO/direc-legal';

@Injectable({
  providedIn: 'root'
})
export class ArccmcService extends GenericoService{

  constructor(private http: HttpClient) { super(); }

  // TRAER CLIENTE POR CIA Y CODIGO
  public getClientXCodigo(cia: string, codigo: string): Observable<Arccmc>{
    return this.http.get<ConsultaExitosa<Arccmc>>(this.url + `/cli/id?cia=${cia}&codigo=${codigo}`, this.options).pipe(
      map( (response: ConsultaExitosa<Arccmc>) => {
        return response.resultado;
      } )
    );
  }

  //LISTAMOS TODOS LOS DEPARTAMENTOS POR COMPAÑIA
  public listarDepartXcia(cia: string): Observable<Arccdp[]>{
    return this.http.get<ConsultaExitosas<Arccdp>>(this.url + `/arccdp/listar?cia=${cia}`, this.options).pipe(
      map( (reponse: ConsultaExitosas<Arccdp>) => {
        return reponse.resultado;
      } )
    );
  }
  //LISTAMOS TODAS LAS PROVINCIAS POR DEPARTAMENTOS Y COMPAÑIA
  public listarProvincXciaAndDepart(cia: string, dp: string): Observable<Arccpr[]>{
    return this.http.get<ConsultaExitosas<Arccpr>>(this.url + `/arccpr/listar?cia=${cia}&dp=${dp}`, this.options).pipe(
      map( (reponse: ConsultaExitosas<Arccpr>) => {
        return reponse.resultado;
      } )
    );
  }
  //LISTAMOS TODAS LAS PROVINCIAS POR DEPARTAMENTOS Y COMPAÑIA
  public listarDistritoXciaAndDepartAndProvinc(cia: string, dp: string, pr: string): Observable<Arccdi[]>{
    return this.http.get<ConsultaExitosas<Arccdi>>(this.url + `/arccdi/listar?cia=${cia}&dp=${dp}&pr=${pr}`, this.options).pipe(
      map( (reponse: ConsultaExitosas<Arccdi>) => {
        return reponse.resultado;
      } )
    );
  }
  //CONSULTAR POR RUC DESDE API DE SUNAT
  public buscarClienteRUCApiSunat(ruc: string): Observable<Empresa>{
    return this.http.get< ConsultaExitosa<Empresa>>(this.url + `/cli/buscarapi?id=${ruc}`, this.options).pipe(
      map( (response: ConsultaExitosa<Empresa>) => {
        return response.resultado;
      } )
    );
  }

  //CONSULTAR POR DNI DESDE API DE SUNAT
  public buscarClienteDNIApiSunat(dni: string): Observable<Persona>{
    return this.http.get< ConsultaExitosa<Persona> >(this.url + `/cli/buscarapi?id=${dni}`, this.options).pipe(
      map( (response: ConsultaExitosa<Persona>) => {
        return response.resultado;
      } )
    );
  }

  //GUARDAR CLIENTE
  public guardarCliente(arccmc: Arccmc): Observable<Arccmc>{
      const body = JSON.stringify(arccmc);
      console.log(body);
      return this.http.post<Guardar<Arccmc>>(this.url + `/cli/save`, body, this.options).pipe(
        map( (response: Guardar<Arccmc>) => {
          return response.detalle;
        } ),
        catchError(err => {
        if (err.status === 400 || err.status === 500) {
          console.error(err.erro.message);
          return throwError(err);
        }
        if (err.error.mensaje) {
          console.error(err.error.message);
        }
        return  throwError(err);
      })
      );
  }

 public listaClientes(datos: DatosClienteDTO) {
    const body = JSON.stringify(datos);
    return this.http.post<Arccmc[]>(this.url + `/cli/list`, body, this.options);
  }

 public totalClientes(cia: string) {
    return this.http.get<Arccmc[]>(this.url + `/cli/list/${cia}`, this.options);
  }
 public traeCliente(datos: DatosClienteDTO){
    const body = JSON.stringify(datos);
    return this.http.post<Arccmc>(this.url + `/cli/cliente`, body, this.options);
  }
  // LISTA DE CLIENTES POR RUC LIKE
  public listaClientesRucLike( cia: string, id: string): Observable<Informacion<Arccmc>> {
    return this.http.get<Informacion<Arccmc>>(this.url + `/cli/listRuc?cia=${cia}&id=${id}`, this.options).pipe(
      catchError(err => {
        if (err.status === 400 || err.status === 500) {
          console.error(err.erro.message);
          return throwError(err);
        }
        if (err.error.mensaje) {
          console.error(err.error.message);
        }
        return  throwError(err);
      })
    );
  }

  //LISTA DE CLIENTES POR RUC LIKE
  public listaClientesDescripLike( cia: string, nombre: string): Observable<Arccmc[]> {
    return this.http.get<ConsultaExitosas<Arccmc>>(this.url + `/cli/list/nombre?cia=${cia}&nombre=${nombre}`, this.options).pipe(
        map( (value: ConsultaExitosas<Arccmc>) => {
          return value.resultado;
        } )
    );
  }

  public listaClienteDtoByCiaAndId( cia: string, codigo: string): Observable< Array<Arccmcdto> > {
    return this.http.get<ConsultaExitosas<Arccmcdto>>(this.url + `/cli/dto/id?cia=${cia}&codigo=${codigo}`, this.options).pipe(
        map( (value: ConsultaExitosas<Arccmcdto>) => {
          return value.resultado;
        } )
    );
  }

  public listaClienteDtoByCiaAndNombre( cia: string, nombre: string): Observable< Array<Arccmcdto> > {
    return this.http.get<ConsultaExitosas<Arccmcdto>>(this.url + `/cli/dto/nombre?cia=${cia}&nombre=${nombre}`, this.options).pipe(
        map( (value: ConsultaExitosas<Arccmcdto>) => {
          return value.resultado;
        } )
    );
  }

  public listaDirecionesLegal( cia: string, nocli: string): Observable< Array<DirecLegal> > {
    return this.http.get<ConsultaExitosas<DirecLegal>>(this.url + `/cli/dto/direc?cia=${cia}&noCli=${nocli}`, this.options).pipe(
        map( (value: ConsultaExitosas<DirecLegal>) => {
          return value.resultado;
        } )
    );
  }

}
