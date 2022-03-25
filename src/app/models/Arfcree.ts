import { Arfcred } from "./Arfcred";
import { ArfcreePK } from "./ArfcreePK";

export class Arfcree {

    arfcreePk: ArfcreePK;
    arfcredList: Arfcred[];
    desde: string;
    hasta: string;
    estado: string;
    monto: number;
    codFP: string;
    cuota: number;
    fecEmi: string;
    detrac: string;
    retencion: string;
    percepcion: string;
    saldoDRP: number;
    porcenDetrac: number;
    porcenRetenc: number;
    porcenPercep: number;
    nombreDRP: string;
    imporDRP: number;

    constructor(){}

}