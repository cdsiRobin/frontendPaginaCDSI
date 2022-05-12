import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { LicenciaService } from '../services/licencia.service';
import { tap } from 'rxjs/operators';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
            private tokenService: TokenService) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

      return this.tokenService.validar().pipe(
        tap(ingresar => {
           if(!ingresar){
            sessionStorage.clear();
            localStorage.clear();
            this.router.navigate(['dashboard/log_arti']);
           }
        })
      );
  }

}
