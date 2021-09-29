import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-serie',
  templateUrl: './dialog-serie.component.html'
})
export class DialogSerieComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogSerieComponent>) { }

  ngOnInit(): void {
  }
  // CERRA LA VENTANA
  public cerrarDialog(): void{
    this.dialogRef.close();
  }

}
