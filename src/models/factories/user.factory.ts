import { FormGroup } from '@angular/forms';
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

    public static toDocument(formGroup: FormGroup): User {
        const user: User = {
            id: formGroup.controls.id.value,
            first_name: formGroup.controls.first_name.value,
            last_name: formGroup.controls.last_name.value,
            description: formGroup.controls.description.value,
            email: formGroup.controls.email.value,
            picture: formGroup.controls.picture.value,
            address: formGroup.controls.address.value
        };
        return user;
    }

}