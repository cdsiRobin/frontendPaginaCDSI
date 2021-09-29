import {Estado} from './estado';

export interface Informacion<T> {
  apiVerision: string;
  estado: Estado;
  resultado: Array<T>;
}
