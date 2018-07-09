import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Observable } from 'rxjs';
import { User } from '../../models/user';
import { FirestoreProvider } from '../../providers/firestore/firestore';

@IonicPage({
  name: 'page-home'
})
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

  add() {

  }

  goToDetail(id: string) {
    this.navCtrl.push('page-details', { id });
  }

}
