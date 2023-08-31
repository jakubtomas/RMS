import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentReference,
} from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable, of } from 'rxjs';
import {
  catchError,
  defaultIfEmpty,
  delay,
  map,
  switchMap,
  tap,
  timeout,
} from 'rxjs/operators';
import { UserDetails } from '../interfaces/userDetails';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  userCollection: AngularFirestoreCollection<UserDetails>;
  userCollection2: AngularFirestoreCollection<UserDetails>;
  myIdUser: string;
  idUserSubject = new BehaviorSubject(null);

  constructor(public afs: AngularFirestore) {
    this.userCollection = this.afs.collection('users');
  }

  setUserId(userId: string): void {
    this.myIdUser = userId;
  }
  addUser(user: UserDetails): Promise<DocumentReference<UserDetails>> {
    return this.userCollection.add(user);
  }

  getAllUsersDetails(): Observable<UserDetails[]> {
    return this.userCollection.snapshotChanges().pipe(
      map((changes) =>
        changes.map((a) => {
          const data = a.payload.doc.data() as UserDetails;
          data.idDocument = a.payload.doc.id;
          return data;
        })
      )
    );
  }

  getUserDetailsInformation(idUser?: string): Observable<UserDetails> {
    if (idUser == null) {
      idUser = this.myIdUser;
    }

    this.userCollection2 = this.afs.collection('users', (ref) =>
      ref.where('idUser', '==', idUser)
    );

    idUser = null;

    return this.userCollection2.snapshotChanges().pipe(
      map((changes) =>
        changes.map((a) => {
          const data = a.payload.doc.data() as UserDetails;
          data.idDocument = a.payload.doc.id;
          return data;
        })
      ),
      // return only first element from array
      map((userDetailsArray) =>
        userDetailsArray.length > 0 ? userDetailsArray[0] : null
      ),
      catchError((error) => {
        return of(null); // Return null in case of error
      })
    );
  }
}
