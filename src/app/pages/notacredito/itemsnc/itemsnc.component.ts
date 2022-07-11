import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-itemsnc',
  templateUrl: './itemsnc.component.html'
})
export class ItemsncComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  public atras(): void {
    this.router.navigate(['pedido/notacredito/list']);
  }

}
