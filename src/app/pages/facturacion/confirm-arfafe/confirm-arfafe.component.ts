import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-arfafe',
  templateUrl: './confirm-arfafe.component.html',
  styleUrls: []
})
export class ConfirmArfafeComponent implements OnInit {

constructor(
    public dialogo: MatDialogRef<ConfirmArfafeComponent>,
    @Inject(MAT_DIALOG_DATA) public mensaje: string) { }

    close(): void {
      this.dialogo.close(false);
    }
    confirm(): void {
      this.dialogo.close(true);
    }

  ngOnInit() {
  }

}