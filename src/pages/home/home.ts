import { AfterViewChecked, Component } from '@angular/core';
import { IonicPage, NavController, PopoverController } from 'ionic-angular';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { User } from '../../models/user';
import { FirestoreProvider } from '../../providers/firestore/firestore';
import { SortProvider } from '../../providers/sort/sort';
import { PopoverPage } from '../popover/popover';

@IonicPage({
  name: 'page-home'
})
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements AfterViewChecked {

  users: Observable<User[]>;

  constructor(
    public navCtrl: NavController,
    private firestore: FirestoreProvider,
    private popoverCtrl: PopoverController,
    private sortProvider: SortProvider
  ) {
    this.users = this.sortProvider.getSortObservable().pipe(
      mergeMap((sort: string) => this.firestore.getAllUsers(sort))
    );
  }

  ngAfterViewChecked() {
    console.log('DEBUG -- HomePage.ngAfterViewChecked -- ' + new Date().getTime());
  }

  presentPopover(ev) {
    let popover = this.popoverCtrl.create(PopoverPage);
    popover.present({ ev });
  }

  goToDetail(id: string) {
    this.navCtrl.push('page-details', { id });
  }

}
