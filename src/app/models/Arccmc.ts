import { IdArccmc } from './IdArccmc';
import { ArcctdaEntity } from './arcctda-entity';

export class Arccmc {
  objIdArc: IdArccmc;
  nombre: string;
  direccion: string;
  dni: string;
  ruc: string;
  telefono: string;
  celular: string;
  extranjero: string;
  tipo: string;
  activo: string;
  web: string;
  pais: string;
  documento: string;
  email: string;
  clase: string;
  //codPais: string;
  codVenCob: string;
  tipoFpago: string;
  codFpago: string;
  arcctdaEntity: ArcctdaEntity[];
}
