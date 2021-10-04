import {IArcgtc} from '../interfaces/IArcgtc';
import {IArcgtcpk} from '../interfaces/IArcgtcpk';

export class Arcgtc implements IArcgtc{
  arcgtcPK: IArcgtcpk;
  tipoCambio: number;
}
