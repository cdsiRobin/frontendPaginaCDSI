import {ArfaccPK} from './arfaccPK';
import { IArfacc } from '../interfaces/IArfacc';

export class Arfacc implements IArfacc{
  arfaccPK: ArfaccPK;
  activo: string;
  consDesde: number;
  consHasta: number;
  consInicio: number;
  indControlAuto: string;
}
