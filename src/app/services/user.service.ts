import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { UserDetails } from '../interfaces/userDetails';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userCollection: AngularFirestoreCollection<UserDetails>;
  userCollection2: AngularFirestoreCollection<UserDetails>;
  //myIdUser = localStorage.getItem('idUser');
  myIdUser;
  idUserSubject = new BehaviorSubject(null);


  constructor(public afs: AngularFirestore,
  ) {
    this.userCollection = this.afs.collection('users');
  }

  setUserId(userId: string): void {
    this.myIdUser = userId;
  }
  // todo add id parameter
  addUser(user: UserDetails): Promise<DocumentReference<UserDetails>> {
    return this.userCollection.add(user);
  }

  getAllUsersDetails(): Observable<UserDetails[]> {
    return this.userCollection.snapshotChanges().pipe(
      map(changes => changes.map(a => {
        const data = a.payload.doc.data() as UserDetails;
        data.idDocument = a.payload.doc.id;
        return data;
      })));
  }

  getUserDetailsInformation(idUser?: string): Observable<any> {


    //  return this.idUserSubject.pipe(
    //   switchMap((idUserSubject) => {
    //     console.log('userSubject');

    //     console.log(idUserSubject);

    //     return of(1);
    //   })
    // );

    if (idUser == null) {
      console.log('moje idecko ' + this.myIdUser);

      idUser = this.myIdUser;
    }

    this.userCollection2 = this.afs.collection('users',
      ref => ref.where('idUser', '==', idUser)
    );

    idUser = null;


    //this  working
    return this.userCollection2.snapshotChanges().pipe(
      map(changes => changes.map(a => {
        const data = a.payload.doc.data() as UserDetails;
        data.idUser = a.payload.doc.id;
        return data;
      })));



    // return this.userCollection2.stateChanges().pipe(
    //   map(changes => changes.map(a => {
    //     const data = a.payload.doc.data() as UserDetails;

    //     data.id = a.payload.doc.id;
    //     return data;
    //   })))
    //   .pipe(
    //     tap((response) =>

    //       console.log('////////////////// ', response))
    //   );

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
