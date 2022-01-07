import { Estado } from './estado';
export interface ConsultaExitosa<T> {
  estado: Estado;
  resultado: T
}
