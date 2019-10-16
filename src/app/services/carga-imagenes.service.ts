import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FileItem } from '../models/file-item';
import * as firebase from 'firebase';



@Injectable({
  providedIn: 'root'
})
export class CargaImagenesService {

  private CARPETA_IMAGENES = 'img';

  constructor( private db: AngularFirestore ) {}


  cargarImagenesFirebase( imagenes: FileItem[] )  {

    const storageRef = firebase.storage().ref(); // Referencia para la base del Api de firebase

    // Barrido de todas las imagenes subidas
    for ( const item of imagenes  ) {

      item.estaSubiendo = true;
      if ( item.progreso >= 100 ) {
        continue; // Si ya se subio, saltearse a la siguiente iteración (saltea lo que sigue del bloque)
      }

      const uploadTask: firebase.storage.UploadTask = storageRef.child(`${ this.CARPETA_IMAGENES }/${ item.nombreArchivo }`)
                                                                .put(item.archivo);

      // Se actualiza y disparen eventos cuando cambia el estado de lo aclarado arriba.
      uploadTask.on( firebase.storage.TaskEvent.STATE_CHANGED,

        ( snapshot: firebase.storage.UploadTaskSnapshot ) => {
          item.progreso = ( snapshot.bytesTransferred / snapshot.totalBytes ) * 100;
        },

        ( error ) => console.log('Error al subir', error),

        // Si todo resulta bien
        () => {

          console.log('Imagen cargada correctamente');
          uploadTask.snapshot.ref.getDownloadURL().then(

            (onfullfilled: any) => {
              console.log('(promise) la url de descarga es  ' + onfullfilled);
              item.url = onfullfilled;
              item.estaSubiendo = false;

              this.guardarImagen({
                nombre: item.nombreArchivo,
                url: item.url
              });

            },

          (onrejected: any) => {
            console.log('(promise) la url de descarga fue rechazada');
          });

        }
      );
    }
  }

  private guardarImagen( imagen: { nombre: string, url: string} ) {
    this.db.collection(`/${this.CARPETA_IMAGENES}`)
            .add(imagen);
  }

}
