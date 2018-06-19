import * as firebase from 'firebase';
import { User } from "../user";

export class UserFactory {

    public static fromDocument(doc: firebase.firestore.DocumentSnapshot): User {
        const user: User = {
            id: doc.id,
            first_name: doc.data().first_name,
            last_name: doc.data().last_name,
            description: doc.data().description,
            email: doc.data().email,
            picture: doc.data().picture,
            address: doc.data().address
        };
        return user;
    }

}