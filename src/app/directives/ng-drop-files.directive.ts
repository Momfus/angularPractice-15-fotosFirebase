import {  Directive,
          EventEmitter,
          ElementRef,
          HostListener,
          Input,
          Output } from '@angular/core';
import { FileItem } from '../models/file-item';

@Directive({
  selector: '[appNgDropFiles]'
})
export class NgDropFilesDirective {

  @Input() archivos: FileItem[] = [];
  @Output() mouseSobre: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  // ELemento encima
  @HostListener('dragover', ['$event'] )
  public onDragEnter( event: any ) {

    this.mouseSobre.emit( true );

  }

  // Elemento sacado
  @HostListener('dragleave', ['$event'] )
  public onDragLeave( event: any ) {

    this.mouseSobre.emit( false );

  }

  //#region Validaciones

    // Saber si ha sido droppeado la imagen y si es imagen para cargarse
    private _archivoPuedeSerCargado( archivo: File ): boolean {

      if ( !this._archivoYaFueDroppeado(archivo.name) && this._esImagen( archivo.type ) ) {

        return true;

      } else {

        return false;

      }

    }

    // Previene que al dejar la imagen se abra por defecto
    private _prevenirDetener( event ) {

      event.preventDefault();
      event.stopPropagation();

    }

    // Para asegurarme que el archivo no haya sido dropeado o ya no este en el arreglo 'archivos'
    private _archivoYaFueDroppeado( nombreArchivo: string ): boolean {

      for ( const archivo of this.archivos ) {

        if ( archivo.nombreArchivo === nombreArchivo ) {

          console.log('El archivo ' + nombreArchivo + ' ya está agregado');
          return true;

        }

      }

      return false; // Si no lo encontro en el for anterior

    }

    // Aceptar solo imágenes (recibe la cadena de tipo de archivo)
    private _esImagen( tipoArchivo: string ): boolean {

      return ( tipoArchivo === '' || tipoArchivo === undefined ) ? false : tipoArchivo.startsWith('image');

    }

  //#endregion

}
