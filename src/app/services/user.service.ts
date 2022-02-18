import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserDetails } from '../interfaces/userDetails';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userCollection: AngularFirestoreCollection<UserDetails>;
  userCollection2: AngularFirestoreCollection<UserDetails>;
  myIdUser = localStorage.getItem('idUser');

  constructor(public afs: AngularFirestore) {
    this.userCollection = this.afs.collection('users');
  }

  // todo add id parameter
  addUser(user: UserDetails): Promise<DocumentReference<UserDetails>> {
    return this.userCollection.add(user);
  }


  getAllUsersDetails(): Observable<UserDetails[]> {
    return this.userCollection.snapshotChanges().pipe(
      map(changes => changes.map(a => {
        const data = a.payload.doc.data() as UserDetails;
        data.id = a.payload.doc.id;
        return data;
      })));
  }

  getUserDetailsInformation(idUser?: string): Observable<UserDetails[]> {

    if (idUser == null) {
      idUser = this.myIdUser;
    }

    this.userCollection2 = this.afs.collection('users',
      ref => ref.where('id', '==', idUser)
    );

    return this.userCollection2.snapshotChanges().pipe(
      map(changes => changes.map(a => {
        const data = a.payload.doc.data() as UserDetails;
        data.id = a.payload.doc.id;
        return data;
      })));
  }




  // getMeetingsByIdBusiness(idBusiness: string): Observable<Meeting[]> {
  //   this.meetingCollection3 = this.afs.collection('meetings',
  //     ref => ref.where('idBusiness', '==', idBusiness)
  //   );

  //   return this.meetingCollection3.valueChanges();
  // }

  // read get


  // update


  // delete User


}
