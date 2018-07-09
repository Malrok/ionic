import { Component } from '@angular/core';
import { IonicPage, NavController, PopoverController } from 'ionic-angular';
import { Observable } from 'rxjs';
import { User } from '../../models/user';
import { FirestoreProvider } from '../../providers/firestore/firestore';
import { PopoverPage } from '../popover/popover';

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
    private firestore: FirestoreProvider,
    private popoverCtrl: PopoverController
  ) {
    this.users = this.firestore.getAllUsers();
  }

  presentPopover(ev) {
    let popover = this.popoverCtrl.create(PopoverPage);
    popover.present({ ev });
  }

  goToDetail(id: string) {
    this.navCtrl.push('page-details', { id });
  }

}
