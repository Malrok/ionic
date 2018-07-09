import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImagePicker } from '@ionic-native/image-picker';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import 'rxjs/add/operator/first';
import { UserFactory } from '../../models/factories/user.factory';
import { User } from '../../models/user';
import { FirestoreProvider } from '../../providers/firestore/firestore';
import { StorageProvider } from '../../providers/storage/storage';

const OPTIONS = {
  maximumImagesCount: 1
};

@IonicPage({
  name: 'page-details'
})
@Component({
  selector: 'page-details',
  templateUrl: 'details.html',
})
export class DetailsPage implements OnInit {

  public formGroup: FormGroup;

  public saving: boolean = false;

  private pickedImage: boolean = false;

  constructor(
    public navParams: NavParams,
    private navCtrl: NavController,
    private firestore: FirestoreProvider,
    private fb: FormBuilder,
    private picker: ImagePicker,
    private storage: StorageProvider
  ) { }

  ngOnInit() {
    const id = this.navParams.get('id');
    if (id === 'new') {
      this.createFormGroup(UserFactory.newInstance());
    } else {
      this.firestore.getUserById(id)
        .first()
        .subscribe((user: User) => this.createFormGroup(user));
    }
  }

  private createFormGroup(user: User) {
    this.formGroup = this.fb.group({
      id: [user.id],
      first_name: [user.first_name, Validators.required],
      last_name: [user.last_name, Validators.required],
      description: [user.description],
      email: [user.email, [Validators.required, Validators.email]],
      picture: [user.picture],
      address: [user.address]
    });
  }

  public pickImage(): void {
    this.picker.getPictures(OPTIONS).then((results) => {
      if (typeof results === 'string' && results === 'OK') {
        // permission has been requested
        return Promise.resolve();
      }
      if (results.length > 1) {
        console.error('only one picture should be picked');
      } else {
        this.pickedImage = true;
        this.formGroup.controls.picture.patchValue(results[0]);
      }
    }, console.error);
  }

  public submit() {
    this.saving = true;
    if (this.pickedImage) {
      this.storage.uploadFile(this.formGroup.controls.picture.value)
        .then((url) => {
          this.formGroup.controls.picture.patchValue(url);
          this.save();
        }).catch(console.error);
    } else {
      this.save();
    }
  }

  private save() {
    this.firestore.saveUser(this.formGroup)
      .then(() => {
        this.navCtrl.pop();
      }).catch(console.error);
  }

}
