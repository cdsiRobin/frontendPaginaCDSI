export class DatosCajaDTO{

  cia:string;
  centro:string;
  caja:string;
  cajera:string;
  fecha: string;
  fechasgte: string;

  constructor(cia: string, centro: string, caja: string,cajera:string) {
    this.cia = cia;
    this.centro = centro;
    this.caja = caja;
    this.cajera = cajera;
  }
}
