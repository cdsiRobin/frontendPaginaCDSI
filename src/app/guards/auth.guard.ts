import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
// import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {
  }

  canActivate(): boolean {

    if ( localStorage.getItem('token') || sessionStorage.getItem('user') ) {
         return true;
    } else {
      this.router.navigateByUrl('/login');
      return false;
    }

  }

}
