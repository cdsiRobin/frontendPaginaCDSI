import { Estado } from './estado';

export interface Infor<T> {
  apiVerision: string;
  estado: Estado;
  resultado: T;
}
