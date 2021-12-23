import { arfaflPK } from "./arfaflPK";

export class Arfafl {

    arfaflPK: arfaflPK;

    bodega: string;
    no_ARTI: string;
    lote: Date;
    no_ENTRADA: string;
    cantidad_FACT: number;
    cantidad_ORIG: number;
    cantidad_ENTR: number;
    cantidad_DEV: number;
    tipo_PRECIO: string;
    costo: number;
    precio_UNIT: number;
    precio_UNIT_ORIG: number;
    descuento: number;
    total: number;
    ind_PARENTESCO: string;
    cod_CLI: string;
    can_CLI: number;
    dscto_FPAGO: number;
    dscto_CLIENTE: number;
    dscto_PROMOCION: number;
    dscto_OTROS: number;
    igv: number;
    isc: number;
    d_PROMO: number;
    d_COMER: number;
    d_FPAGO: number;
    valor_VENTA: number;
    codigo_NI: string;
    descripcion: string;
    p_DSCTO1: number;
    p_DSCTO2: number;
    p_DSCTO3: number;
    m_DSCTO1: number;
    m_DSCTO2: number;
    m_DSCTO3: number;
    codigo: string;
    imprime: string;
    imp_ISC: number;
    imp_IGV: number;
    fact_ANTI: string;
    ind_LIN: string;
    ret_COMISION: number;
    tipo_ARTI: string;
    tipo_REFE_FACTU: string;
    no_REFE_FACTU: string;
    precio_UNIT_REF: number;
    p_DSCTO3_REF: number;
    no_GUIA: string;
    cantidad_REF: number;
    precio_SIGV: number;
    total_LIN: number;
    concepto: string;
    total_BRUTO: number;
    concepto_CTA: string;
    no_CONTA: number;
    nro_LECTURA: string;
    cod_T_PED: string;
    centro_COSTO: string;
    totalbk: number;
    marca1: string;
    tipo_DOC_ALM: string;
    no_DOCU_ALM: string;
    ind_COD_BARRA: string;
    marca2: string;
    no_ARTI1: string;
    marca3: string;
    tipo_AFECTACION: string;
    oper_GRAVADAS: number;
    oper_INAFECTAS: number;
    oper_EXONERADAS: number;
    oper_GRATUITAS: number;
    precio_UNI: number;
    icbper: number;
    tipo_BS: string;

    constructor(){}
}