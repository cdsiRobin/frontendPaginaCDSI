import { Estado } from './estado';
export interface ConsultaExitosas<T> {
  estado: Estado;
  resultado: Array<T>;
}
