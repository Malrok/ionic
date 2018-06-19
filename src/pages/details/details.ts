import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavParams } from 'ionic-angular';
import { Subscription } from 'rxjs';
import { FirestoreProvider } from '../../providers/firestore/firestore';

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
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.userSubscription = this.firestore.getUserById(this.navParams.get('id'))
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

  public submit() {
    console.log('submitted');
  }

}
