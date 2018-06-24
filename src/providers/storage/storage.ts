import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireStorageReference } from 'angularfire2/storage';


@Injectable()
export class StorageProvider {

  constructor(private afStorage: AngularFireStorage) {
  }

  public uploadFile(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const filename = filePath.split('/').pop();
      const fileRef: AngularFireStorageReference = this.afStorage.ref(`avatars/${filename}`);
      this.encodeImageUri(filePath, function (image64) {
        fileRef.putString(image64, 'data_url')
          .then(snapshot => {
            fileRef.getDownloadURL().first().subscribe((downloadUrl: string) => {
              resolve(downloadUrl);
            });
          })
          .catch(reject);
        //   const task: AngularFireUploadTask = this.afStorage.upload(`avatars/${filename}`, filename);
        //   task.snapshotChanges().pipe(
        //     finalize(() => {
        //       fileRef.getDownloadURL().first().subscribe((downloadUrl: string) => {
        //         resolve(downloadUrl);
        //       });
        //     })
        //   )
        //     .first()
        //     .subscribe(console.log, reject);
      });
    });
  }

  private encodeImageUri(imageUri, callback) {
    var c = document.createElement('canvas');
    var ctx = c.getContext("2d");
    var img = new Image();
    img.onload = function () {
      var aux: any = this;
      c.width = aux.width;
      c.height = aux.height;
      ctx.drawImage(img, 0, 0);
      var dataURL = c.toDataURL("image/jpeg");
      callback(dataURL);
    };
    img.src = imageUri;
  };

}
