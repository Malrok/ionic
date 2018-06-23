import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImagePicker } from '@ionic-native/image-picker';
import { IonicPage, NavParams } from 'ionic-angular';
import { Subscription } from 'rxjs';
import { FirestoreProvider } from '../../providers/firestore/firestore';

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
export class DetailsPage implements OnInit, OnDestroy {

  public formGroup: FormGroup;
  private userSubscription: Subscription;

  constructor(
    public navParams: NavParams,
    private firestore: FirestoreProvider,
    private fb: FormBuilder,
    private picker: ImagePicker
  ) { }

  ngOnInit() {
    const id = this.navParams.get('id') || '02aykIRoL0eeNJLx8aTk';
    console.log(id);
    this.userSubscription = this.firestore.getUserById(id)
      .subscribe((user) => {
        this.formGroup = this.fb.group({
          first_name: [user.first_name, Validators.required],
          last_name: [user.last_name, Validators.required],
          description: [user.description],
          email: [user.email, [Validators.required, Validators.email]],
          picture: [user.picture],
          address: [user.address]
        });
      });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
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
        this.formGroup.controls.picture.patchValue(results[0]);
      }
    }, (err) => console.error(err));
  }

  public submit() {
    console.log('submitted');
    // TODO : upload picture if it was changed
  }

}
