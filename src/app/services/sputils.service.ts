import { Injectable } from '@angular/core';
import { GenericoService } from './generico/generico.service';
import { HttpClient } from '@angular/common/http';
import { NotaCreditoci } from '../DTO/nota-creditoci';
import { Observable } from 'rxjs';
import { StoredProcedure } from '../interfaces/stored-procedure';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class SputilsService extends GenericoService {

  constructor(
    private http: HttpClient
  ) { super(); }

  public crearNotaCreditoCi(ncci: NotaCreditoci): Observable<string>{
    const body = JSON.stringify(ncci);
    return this.http.post<StoredProcedure<string>>(this.url + `/SPUtils/nc/ci`, body, this.options).pipe(
      map( (response: StoredProcedure<string>) => {
         return response.resultado;
      })
    );
   }

}
