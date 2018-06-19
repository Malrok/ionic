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

    // public static fromDocumentSnapshot(docChange: DocumentSnapshot<User>): User {
    //     const user: User = {
    //         id: docChange.id,
    //         first_name: docChange.data().first_name,
    //         last_name: docChange.data().last_name,
    //         description: docChange.data().description,
    //         email: docChange.data().email,
    //         picture: docChange.data().picture,
    //         address: docChange.data().address
    //     };
    //     return user;
    // }

}