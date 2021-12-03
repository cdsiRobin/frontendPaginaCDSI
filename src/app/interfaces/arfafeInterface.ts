import { Arfafe } from '../models/Arfafe';
import {Estado} from './estado';

export interface arfafeInterface {
  apiVerision: string;
  estado: Estado;
  resultado: Arfafe;
}
