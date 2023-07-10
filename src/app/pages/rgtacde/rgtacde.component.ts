import { Component, OnInit } from '@angular/core';
import { RgtacdeService } from '../../services/rgtacde.service';
import { tap } from 'rxjs/operators';
import { Rgtacde } from '../../models/rgtacde';
import { ActivatedRoute } from '@angular/router';
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'app-rgtacde',
  templateUrl: './rgtacde.component.html'
})
export class RgtacdeComponent implements OnInit {
  public rgtacdes: Rgtacde[];
  public usuario: Usuario;
  paginador: any;
  constructor(public serveRg: RgtacdeService, private actiRouter: ActivatedRoute ) { }

  ngOnInit() {
    // VAMOS A TRAER EL PAGE DE RGTACDDE
    this.actiRouter.paramMap.subscribe( params => {
      let page: number = +params.get('page');
      if (!page) { // SI NO EXISTE
        page = 0;
      }
      this.usuario = new Usuario();
      this.usuario = JSON.parse(sessionStorage.getItem('usuario'));
      this.serveRg.getPageRgtacde(this.usuario, page).pipe(
          tap(response => {
            (response.content as Rgtacde[]).forEach( rgtacde => {
               // console.warn(rgtacde.usuario);
            });
          })
        ).subscribe( response => {
          this.rgtacdes = response.content as Rgtacde[];
          this.paginador = response;
        });
      }
    );

  }

}
