import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FirestoreProvider } from '../../providers/firestore/firestore';
import { Observable } from 'rxjs';
import { User } from '../../models/user';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  users: Observable<User[]>;

  constructor(
    public navCtrl: NavController,
    private firestore: FirestoreProvider
  ) {
    this.users = this.firestore.getAllUsers();
  }

}
