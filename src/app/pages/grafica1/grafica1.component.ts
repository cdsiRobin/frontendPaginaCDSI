import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: [
  ]
})
export class Grafica1Component implements OnInit {

  public labels1: string[] = ['Pan','Refresco','Tacos'];
  public data1 = [
    [10,15,40],[100,12,300]
  ];
  public data2 = [
    [10,15,40],[100,12,300],[51,80,100]
  ];
 
  constructor() { }

  ngOnInit(): void {
  }

}
