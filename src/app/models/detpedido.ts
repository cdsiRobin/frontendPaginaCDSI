export class Detpedido {
  item: number;
  tipo: string;
  codigo: string;
  medida: string;
  descripcion: string;
  cantidad: number;
  precio: number;
  dcto: number;
  igv: number;
  total:number;

  constructor(item: number,tipo: string,codigo: string,medida: string,descripcion: string,cantidad: number,
             precio: number,igv: number,total:number){
      this.item = item;
      this.tipo = tipo;
      this.codigo = codigo;
      this.medida = medida;
      this.descripcion = descripcion;
      this.cantidad = cantidad;
      this.precio = precio;
      this.igv = igv;
      this.total = total;
  }

  public calcularIgv(): number{
     return (this.precio * this.cantidad) * 0.18;
  }

  public calcularTotal(): number{
    return ( (this.precio * this.cantidad) ) + this.calcularIgv();
  }

}
