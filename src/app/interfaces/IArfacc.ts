import { IarfaccPK } from './IarfaccPK';
export interface IArfacc {
  arfaccPK: IarfaccPK;
  activo: string;
  consDesde: number;
  consHasta: number;
  consInicio: number;
  indControlAuto: string;
}
