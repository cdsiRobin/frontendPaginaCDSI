import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Company } from '../models/company';
import { OtherService } from './other.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private http: HttpClient, private other: OtherService) {}

   // VAMOS A MOSTRAR LA LISTA DE COMPAÑIAS
   public getListaCias(): Observable<Company[]> {
    return this.http.get<Company[]>(this.other.getUrl() + '/company/list');
  }
  // METODO QUE NOS TRAE UNA COMPAÑIA
  public getCompany(cia: string): Observable<Company> {
    return this.http.get<Company>(this.other.getUrl() + `/company/${cia}`);
  }


}

