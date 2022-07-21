import { Estado } from './estado';
export interface Consulta<T> {
  apiVerision: string;
  estado: Estado;
  resultado: T;
}
