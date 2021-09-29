import { IarfaccPK } from './IarfaccPK';
export interface IArfacc {
  arfaccPK: IarfaccPK;
  anoDoc: string;
  consInicio: number;
  consDesde: number;
  consHasta: number;
  lineas: number;
  indControlAuto: string;
  tipoM: string;
  activo: string;
  indFechaAuto: string;
  noCaba: string;
  feria: number;
  noCliente: string;
  usuProv: string;
  fecCrea: Date;
  usuCrea: string;
  fecModi: Date;
  usuModi: string;
  usuario: string;
  marca1: string;
}
