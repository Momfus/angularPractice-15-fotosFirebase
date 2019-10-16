import {  Directive,
          EventEmitter,
          ElementRef,
          HostListener,
          Input,
          Output } from '@angular/core';
import { FileItem } from '../models/file-item';

@Directive({
  selector: '[appNgDropFiles]',
})

export class NgDropFilesDirective {

  @Input() archivos: FileItem[] = [];
  @Output() mouseSobre: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  // ELemento encima
  @HostListener('dragover', ['$event'] )
  public onDragEnter( event: any ) {

    this.mouseSobre.emit( true );
    this._prevenirDetener( event );

  }

  // Elemento sacado
  @HostListener('dragleave', ['$event'] )
  public onDragLeave( event: any ) {

    this.mouseSobre.emit( false );

  }

  // Al soltarse el mouse al dejarlo encima
  @HostListener('drop', ['$event'] )
  public onDrop( event: any ) {


    const transferencia = this._getTransferencia( event );

    if ( !transferencia ) {

      return; // Si no hay nada que transferir, no se hace nada (se sale)

    }

    this._extraerArchivos( transferencia.files);
    this._prevenirDetener( event );

    this.mouseSobre.emit( false );

  }


  // Obtener la trasnferencia de archivos, dependiendo el navegador es como lo tiene que devolver
  private _getTransferencia( event: any ) {

    return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer;

  }

  // Extraer los archivos de lo droppeado
  private _extraerArchivos( archivosLista: FileList ) {

    // Tomar las propiedades del archivo para convertir en un arreglo
    // tslint:disable-next-line: forin
    for ( const propiedad in Object.getOwnPropertyNames( archivosLista ) ) {

      const archivoTemporal = archivosLista[propiedad];

      if ( this._archivoPuedeSerCargado( archivoTemporal ) ) {

        const nuevoArchivo = new FileItem( archivoTemporal );
        this.archivos.push( nuevoArchivo );

      }

    }


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
