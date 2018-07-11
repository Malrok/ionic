import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { UserFactory } from '../../models/factories/user.factory';
import { User } from '../../models/user';


@Injectable()
export class FirestoreProvider {

  constructor(private db: AngularFirestore) { }

  getAllUsers(sort: string): Observable<User[]> {
    return this.db.collection<User>('users', ref => ref.orderBy(sort)).snapshotChanges().map(snapshots =>
      snapshots.map(doc => {
        return UserFactory.fromDocument(doc.payload.doc);
      })
    );
  }

  getUserById(id: string): Observable<User> {
    return this.db.doc<User>(`users/${id}`).snapshotChanges().map(snapshot =>
      UserFactory.fromDocument(snapshot.payload)
    );
  }

  saveUser(formGroup: FormGroup): Promise<void> {
    let id = formGroup.controls.id.value;
    if (!id) {
      id = this.db.createId();
      formGroup.controls.id.patchValue(id);
    };
    return this.db.doc<User>(`users/${id}`).set(UserFactory.toDocument(formGroup));
  }

}
