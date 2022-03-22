import { EstadoUpdate } from './estado-update';
export interface Actualizar<T> {
  apiVerision: string;
  estado: EstadoUpdate<T>;
}
