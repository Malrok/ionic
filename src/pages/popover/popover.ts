import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { SortProvider } from '../../providers/sort/sort';

@Component({
  templateUrl: 'popover.html',
})
export class PopoverPage {

  constructor(
    public viewCtrl: ViewController,
    private sortProvider: SortProvider
  ) {
  }

  public setSortByName() {
    this.sortProvider.setSortByName();
    this.viewCtrl.dismiss();
  }

  public setSortByDistance() {
    this.sortProvider.setSortByDistance();
    this.viewCtrl.dismiss();
  }

}
