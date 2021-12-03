import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { ArfafeDTO } from "src/app/DTO/arfafeDTO";
import { Arfafe } from "src/app/models/Arfafe";
import { ArfafePK } from "src/app/models/ArfafePK";
import { ArfafeService } from "src/app/services/arfafe.service";

@Component({
  selector: 'app-detail-arfafe',
  templateUrl: './detail-arfafe.component.html',
  styleUrls: []
})

export class DetailArfafeComponent implements OnInit {
    // groupEmpresa:FormGroup;
    // groupArticulo:FormGroup;

    arfafe: Arfafe;
    detalle: Arfafe;
    cia: string;
    doc: string;
    fact: string;

  constructor(private route: ActivatedRoute, private router: Router, private arfafeService: ArfafeService) { }

  ngOnInit(): void {
    console.log("entro detalle");
      this.route.queryParams.subscribe(params => {
        this.cia = params['nocia'];
        this.doc = params['docu'];
        this.fact = params['factura'];
        console.log(this.cia + " - "+ this.doc + " - "+ this.fact);
      });
      this.arfafeService.arfafeDetalle(new ArfafeDTO(this.cia,this.doc,this.fact)).
    subscribe(n => {
    this.detalle = n.resultado;
    });
    this.findArfafe();
    // console.log(this.detalle);
    //   this.groupEmpresa = new FormGroup({
    //     ruc: new FormControl(),
    //     racSoc: new FormControl()
    //   });
    //   this.groupArticulo = new FormGroup({
    //     codProd: new FormControl(),
    //     desProd: new FormControl(),
    //     cantProd: new FormControl()
    //   });
  }

  findArfafe(){
    this.arfafeService.arfafeDetalle(new ArfafeDTO(this.cia,this.doc,this.fact)).
    subscribe(n => {
    this.arfafe = n.resultado;
    //this.detalle = this.arfafe;
      //this.arf = this.arfafe
    // var filter = n.resultado.some(function(item, index) {this.arfafe = index; return item.arfafePK.noFactu == this.fact;});
    //   console.log(n.resultado.findIndex(x => x.arfafePK.noFactu === this.fact));
    console.log(this.arfafe);
    });
  }

}

