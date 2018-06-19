import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { FirestoreProvider } from '../../providers/firestore/firestore';
import { Observable } from 'rxjs';
import { User } from '../../models/user';

/**
 * Generated class for the DetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'page-details'
})
@Component({
  selector: 'page-details',
  templateUrl: 'details.html',
})
export class DetailsPage {

  public user: Observable<User>;

  constructor(
    public navParams: NavParams,
    private firestore: FirestoreProvider
  ) {
    this.user = this.firestore.getUserById(navParams.get('id'));
  }

}
