export interface Guardar<T> {
  codigo: string;
  mensaje: string;
  detalle: T;
  estado: number;
  error: string;
  fechaHora: Date;
}
