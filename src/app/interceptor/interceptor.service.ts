import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
// import { TokenService } from '../services/token.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor() { }
  /*constructor(private tokenService: TokenService) { }*/

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //console.log('ENTRO INTERCEPTOR =)');
    //this.tokenService.validarLicencia();
    return next.handle(req).pipe(
       catchError(this.manejerError)
    );
  }

  private manejerError(error: HttpErrorResponse) {
      console.log('Sucedio un error');
      console.warn(error);
      return throwError('Error personalizado');
  }
}
