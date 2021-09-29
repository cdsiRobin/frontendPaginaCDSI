import {IArfacc} from '../interfaces/IArfacc';
import {ArfaccPK} from './arfaccPK';

export class Arfacc implements IArfacc{
  arfaccPK: ArfaccPK;
  activo: string;
  anoDoc: string;
  consDesde: number;
  consHasta: number;
  consInicio: number;
  fecCrea: Date;
  fecModi: Date;
  feria: number;
  indControlAuto: string;
  indFechaAuto: string;
  lineas: number;
  marca1: string;
  noCaba: string;
  noCliente: string;
  tipoM: string;
  usuCrea: string;
  usuModi: string;
  usuProv: string;
  usuario: string;
}
