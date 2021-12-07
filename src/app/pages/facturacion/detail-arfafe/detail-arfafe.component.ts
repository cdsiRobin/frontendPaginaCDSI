import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ArfafeDTO } from "src/app/DTO/arfafeDTO";
import { Arfafe } from "src/app/models/Arfafe";
import { ArfafeService } from "src/app/services/arfafe.service";

@Component({
  selector: 'app-detail-arfafe',
  templateUrl: './detail-arfafe.component.html',
  styleUrls: []
})

export class DetailArfafeComponent implements OnInit {

    tipoComprobante: string = 'Factura';
    detalle:Arfafe = new Arfafe();
    cia: string;
    doc: string;
    fact: string;

  constructor(private route: ActivatedRoute, private router: Router, private arfafeService: ArfafeService) { }

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
        console.log(a.resultado);
        console.log(a.resultado.arfaflList);
      }
    )
  });
}
}

