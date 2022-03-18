import { ArfafePK } from './ArfafePK';
import { Arfafl } from './arfafl';

export class Arfafe {

    arfafePK: ArfafePK;

    arfaflList: Arfafl[];

    grupo: string;
    no_CLIENTE: string;
    centro: string;
    bodega: string;
    fecha: Date;
    tipo_CLIENTE: string;
    nbr_CLIENTE: string;
    direccion: string;
    plazo: number;
    no_VENDEDOR: string;
    tipo_PRECIO: string;
    moneda: string;
    tipo_CAMBIO: number;
    porc_DESC: number;
    no_ORDEN: string;
    no_ORDEN_DESC: string;
    tot_LIN: number;
    descuento: number;
    sub_TOTAL: number;
    impuesto: number;
    imp_ISC: number;
    total: number;
    impuesto_DEV: number;
    total_DEV: number;
    observ: string;
    estado: string;
    cod_FPAGO: string;
    ind_ANU_DEV: string;
    doc_DEVOL: string;
    no_DEVOL: string;
    fecha_SYS: string;
    igv: number;
    tipo_DOC_ALMA: string;
    no_REFE_ALMA: string;
    tipo_REFE_FACTU: string;
    no_REFE_FACTU: string;
    no_GUIA: string;
    tipo: string;
    no_CONTA: number;
    comision: number;
    saldo_COMISION: number;
    cod_OPER: string;
    no_CUOTAS: number;
    gasto_ND: number;
    gasto_NC: number;
    gasto_FINAN: number;
    tea: number;
    gastos: number;
    notas_DEB: number;
    notas_CRE: number;
    impuesto_FINAN: number;
    gasto_DE_FLETES: number;
    gasto_DE_SEGUROS: number;
    ind_PER_GRA_CAP: string;
    fre_PAGO_DIAS: number;
    tipo_NOTA: string;
    division: string;
    no_PROYECTO: string;
    cierre_COM: string;
    cierre_PAG: string;
    codigo: string;
    ti_DESPACHO: string;
    zona: string;
    tipo_FACT: string;
    ubi_DIR: string;
    fecha_ENTREGA: string;
    motivo_TRASLADO: string;
    cuser: string;
    codi_ZONA: string;
    ruc: string;
    no_LIQ: string;
    ind_DOC: string;
    codi_PROFE: string;
    no_CLIENTE_TERCE: string;
    alm_DESTINO: string;
    motivo_NC: string;
    cod_T_PED: string;
    concepto: string;
    slado_NETO: number;
    no_LIQ_OFI: string;
    nro_LECTURA: string;
    tipo_ACTIVO: string;
    no_LIQ_SUC: string;
    cod_CLAS_PED: string;
    tipo_FPAGO: string;
    p_DSCTO_GLOBAL: number;
    ano_DOC: string;
    valor_VENTA: number;
    m_DSCTO_GLOBAL: number;
    fecha_VENCE: Date;
    codi_DEPA: string;
    codi_PROV: string;
    codi_DIST: string;
    no_DOCU: string;
    nombre_DIGI: string;
    direccion_DIGI: string;
    cod_TIENDA: string;
    cod_DIR_ENTREGA: string;
    no_SOLIC: string;
    tipo_DOC_CLI: string;
    num_DOC_CLI: string;
    motivo_ANULA: string;
    imprime: string;
    almacen_REF: string;
    tipo_OBSE: string;
    cod_OBSE: string;
    ind_VTA_ANTICIPADA: string;
    cod_SERVICIO: string;
    mod_VENTA: string;
    total_BRUTO: number;
    flete: number;
    t_DESCUENTO: number;
    tipo_NCRED: string;
    ind_IGV: string;
    alias: string;
    ind_PVENT: string;
    cod_CAJA: string;
    cajera: string;
    tipo_DOC_EMP: string;
    num_DOC_EMP: string;
    serie_LIQ: string;
    num_LIQ: string;
    tipo_DOC_LIQ: string;
    ind_NOTA_CRED: string;
    ind_EXPORTACION: string;
    centro_COSTO: string;
    ind_FERIAS: string;
    ind_PROVINCIA: string;
    fec_CREA: string;
    usu_CREA: string;
    usu_MODI: string;
    fec_MODI: string;
    consumo: string;
    redondeo: number;
    convenio: string;
    sub_TOTAL1: number;
    no_CUPON: string;
    no_CUPON_CORREL: number;
    codi_COLE: string;
    codi_LOCAL: string;
    ind_FACT_TEXTO: string;
    imp_FACT_DESC: string;
    tipo_DOC_REF1: string;
    no_SOLIC1: string;
    ind_GUIA_TEXTO: string;
    flag: string;
    excl_AUX: string;
    cod_BCARD: string;
    impuesto_FLETE: number;
    impuesto_GASTOS_ADM: number;
    gastos_ADMINISTRATIVOS: number;
    on_LINE: string;
    peso: number;
    piezas: number;
    departamento_DEST: string;
    provincia_DEST: string;
    distrito_DEST: string;
    telefono_DEST: string;
    marca1: string;
    no_VENDEDOR1: string;
    estado1: string;
    nro_CONVENIO: string;
    marca2: string;
    bodegapro: string;
    vig_PREC_INICIO: string;
    vig_PREC_FIN: string;
    cont_NETO: string;
    no_CLIENTE1: string;
    marca3: string;
    ind_FMULTIPLE: string;
    ind_NC_FICTA: string;
    tipo_REFE_FACTU1: string;
    no_REFE_FACTU1: string;
    codi_CAMP: string;
    no_GUIA_PROM: string;
    no_GUIA_VENTA: string;
    ind_PROMARG: string;
    ind_NC_FICTA1: string;
    no_GUIA_CONSIG: string;
    mot_CONTING: string;
    oper_GRATUITAS: number;
    oper_EXONERADAS: number;
    oper_INAFECTAS: number;
    oper_GRAVADAS: number;
    estado_SUNAT: string;
    tipo_OPERACION: string;
    sustento: string;
    cod_DETRAC: string;
    proc_DETRAC: number;
    valor_REF_DETRAC: number;
    num_CUENTA_DETRAC: string;
    detraccion: number;
    mot_ANU: string;
    est_RES_CON: string;
    cod_HASH: string;
    cod_BARRA_SUNAT: string;
    
    constructor(){}
}