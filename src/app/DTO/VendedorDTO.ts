export class VendedorDTO{
  cia:string;
  codigo:string;
  codEmp:string;
  pass:string;

  constructor(codigo: string, pass: string) {
    //this.cia = cia;
    this.codigo = codigo;
    this.pass = pass;
  }
}
