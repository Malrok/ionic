import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { User } from '../../models/user';
import 'rxjs/add/operator/map';
import { UserFactory } from '../../models/factories/user.factory';


@Injectable()
export class FirestoreProvider {

  constructor(private db: AngularFirestore) { }

  getAllUsers(): Observable<User[]> {
    return this.db.collection<User>('users').snapshotChanges().map(snapshots =>
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

}
