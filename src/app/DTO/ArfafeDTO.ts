export class ArfafeDTO{
    noCia: string;
    tipoDoc: string;
    noFactu: string;
    
    constructor(Cia: string, tipoDoc: string, noFactu: string) {
      this.noCia = Cia;
      this.tipoDoc = tipoDoc;
      this.noFactu = noFactu;
    }
  }