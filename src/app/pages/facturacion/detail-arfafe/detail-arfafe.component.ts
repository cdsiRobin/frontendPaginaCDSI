import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ArfafeDTO } from "src/app/DTO/arfafeDTO";
import { DatosClienteDTO } from "src/app/DTO/DatosClienteDTO";
import { Arfacc } from "src/app/models/arfacc";
import { Arfafe } from "src/app/models/Arfafe";
import { Arfatp } from "src/app/models/Arfatp";
import { Tapfopa } from "src/app/models/tapfopa";
import { ArccmcService } from "src/app/services/arccmc.service";
import { ArcgtcService } from "src/app/services/arcgtc.service";
import { ArfafeService } from "src/app/services/arfafe.service";
import { ArfatpService } from "src/app/services/arfatp.service";
import { TapfopaService } from "src/app/services/tapfopa.service";

@Component({
  selector: 'app-detail-arfafe',
  templateUrl: './detail-arfafe.component.html',
  styleUrls: []
})

export class DetailArfafeComponent implements OnInit {

    tipoComprobante: string = 'Factura';
    detalle:Arfafe = new Arfafe();
    arfacc:Arfacc = new Arfacc();
    tapfopa: Tapfopa = new Tapfopa();
    arfatp: Arfatp = new Arfatp();
    cia: string;
    doc: string;
    fact: string;
    tipoCambio: number;

  constructor(private route: ActivatedRoute, 
    private router: Router, 
    private arfafeService: ArfafeService,
    public clienteServices: ArccmcService,
    private tapfopaService: TapfopaService,
    private arcgtcService: ArcgtcService,
    private arfatpService: ArfatpService,
    public datepipe: DatePipe) { }

  ngOnInit(): void {
    this.cargar();      
  }

  cargar(){
    this.route.queryParams.subscribe(p => {
      this.cia = p['nocia'];
      this.doc = p['docu'];
      this.fact = p['factura'];
      this.arfafeService.arfafeDetalle(new ArfafeDTO(this.cia,this.doc,this.fact))
      .subscribe(a => {
          this.detalle = a.resultado;
          this.traeCliente();
          this.formaPago(a.resultado.tipo_FPAGO);
          this.listaPrecio(a.resultado.tipo_PRECIO);
          this.TCambio();
          console.log(a.resultado);
          console.log(a.resultado.arfaflList);
        }
      )
    });
  }
  traeCliente() {
    let cli = new DatosClienteDTO(sessionStorage.getItem('cia'));
    // cli.documento = this.detalle.no_CLIENTE;
    cli.id = this.detalle.no_CLIENTE;
    console.log(cli);
    this.clienteServices.traeCliente(cli).subscribe(data => {
      this.detalle.direccion = data.arcctdaEntity[0].direccion;
      this.detalle.codi_DEPA = data.arcctdaEntity[0].codiDepa;
      this.detalle.codi_PROV = data.arcctdaEntity[0].codiProv;
      this.detalle.codi_DIST = data.arcctdaEntity[0].codiDist;
      this.detalle.nbr_CLIENTE = data.nombre;
      console.log(data);
    })
  }

  public formaPago(cod: string){
    let list: Tapfopa[] = [];
    this.tapfopaService.listarFormaPagoCiaAndEstado(sessionStorage.getItem('cia'),'A').subscribe(data => {
        list = data.resultado;
        for (const l of list) {
          if (l.tapfopaPK.codFpago === cod) {
            this.tapfopa = l;
            break;
          }
        }
    })
  }

  public TCambio(){
    let fecha = this.datepipe.transform(new Date,'dd/MM/yyyy');
    this.arcgtcService.getTipoCambioClaseAndFecha('02',fecha).subscribe(data => {
        this.tipoCambio = data.resultado.tipoCambio;
    });

  }

  public listaPrecio(cod: string){
    let list: Arfatp[] = [];
    this.arfatpService.getAllListaPrecio(sessionStorage.getItem('cia'),'S').subscribe(json => {
      list = json.resultado;
      for (const l of list) {
        if (l.idArfa.tipo === cod) {
            this.arfatp = l;
            break;
        }
    }
    });
  }


}

