import { Component, OnInit } from '@angular/core';
import { FileItem } from 'src/app/models/file-item';
import { CargaImagenesService } from '../../services/carga-imagenes.service';

@Component({
  selector: 'app-carga',
  templateUrl: './carga.component.html',
  styles: []
})
export class CargaComponent implements OnInit {

  // tslint:disable: no-inferrable-types

  estaSobreElemento: boolean = false;
  archivos: FileItem[] = [];

  constructor(
    public serviceCargaImagenes: CargaImagenesService
  ) { }

  ngOnInit() {
  }

  cargarImagenes() {

    this.serviceCargaImagenes.cargarImagenesFirebase( this.archivos );

  }

}
