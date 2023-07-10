import { Estado } from './estado';
export interface StoredProcedure<T> {
  apiVerision: string;
  estado: Estado;
  resultado: T;
}
