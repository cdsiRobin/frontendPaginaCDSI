import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Arfafe } from "src/app/models/Arfafe";
import { ArfafeService } from "src/app/services/arfafe.service";

@Component({
  selector: 'app-list-arfafe',
  templateUrl: './list-arfafe.component.html',
  styleUrls: []
})

export class ListArfafeComponent implements OnInit {

  cia: string= '01';

  facturas: Arfafe[];

  constructor(private arfafeService: ArfafeService,private router: Router, public route: ActivatedRoute) { }

  ngOnInit(): void {
    this.arfafeService.listaArfafe('01').subscribe(list => {
      this.facturas = list;
    });
  }

  getAllArfafe(){
    this.arfafeService.listaArfafe(this.cia)
    .subscribe(list => {
      this.facturas = list;
      console.log(this.facturas);
    });
  }

}
