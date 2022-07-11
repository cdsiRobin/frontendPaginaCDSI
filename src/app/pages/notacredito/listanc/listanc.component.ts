import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listanc',
  templateUrl: './listanc.component.html'
})
export class ListancComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  public newNotaCredito(nc: string): void{
    if(nc === 'C'){
      this.router.navigate(['pedido/notacredito/items']);
    }else{
      this.router.navigate(['pedido/notacredito/sinitem']);
    }
  }

}
