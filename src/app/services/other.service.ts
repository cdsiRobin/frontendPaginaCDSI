import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OtherService {

  private url: string;
  private cia: string;
  private user: string;
  private roles: string;
  private token: string;
  public httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + this.getToken()
  });

  constructor() { }

  // METODO QUE NOS TRAE LA URL
  public getUrl() {

    // return  this.url = 'http://localhost:8444/api';
    // return this.url = 'http://localhost:8099/spring-boot-backend-pvCdsi/api';
    return this.url = 'http://apipvcdsi.duckdns.org:8033/spring-boot-backend-inve/api';
  }

// SET TOKEN
public setToken(token: string) {
    localStorage.setItem('token', token);
}
// GET TOKEN
public getToken() {
    return this.token = localStorage.getItem('token');
}

// GET CIA
public getCia() {
    return this.cia = sessionStorage.getItem('cia');
}
// SET CIA
public setCia(cia: string) {
   sessionStorage.setItem('cia', cia);
}
// GET USER
public getUser() {
    return this.user = sessionStorage.getItem('user');
}
// GET usuario
public getusuario() {
    return this.user = sessionStorage.getItem('usuario');
}
// SET USER
public setUser(user: string) {
    sessionStorage.setItem('user', user);
}
// GET ROLES
public getRoles(roles: string) {
    return this.roles = sessionStorage.getItem('roles');
}
// SET ROLES
public setRoles(roles: string) {
    sessionStorage.setItem('roles', roles);
}

// METODO QUE NOS PERMITE SALIR
public limpiar() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('mesaje');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('roles');
    sessionStorage.removeItem('lat');
    sessionStorage.removeItem('lng');
    sessionStorage.removeItem('cia');
    sessionStorage.removeItem('rs');
}

}

