import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from '../../../node_modules/rxjs';
import { SortType } from '../../models/sort-type.enum';

@Injectable()
export class SortProvider {

  private sort: BehaviorSubject<string>;

  constructor(
  ) {
    this.sort = new BehaviorSubject<string>(SortType.NAME);
  }

  public getSortObservable(): Observable<string> {
    return this.sort.asObservable();
  }

  public setSortByName() {
    this.sort.next(SortType.NAME);
  }

  public setSortByDistance() {
    this.sort.next(SortType.DISTANCE);
  }

}
