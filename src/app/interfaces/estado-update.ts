export interface EstadoUpdate<T> {
  codigo: string;
  mensaje: string;
  detalle: T;
  estado: number;
  error: string;
  fechaHora: Date;
}
