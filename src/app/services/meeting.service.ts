import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {Business} from "../interfaces/business";
import {Meeting} from "../interfaces/meeting";
import {BusinessPermission} from "../interfaces/businessPermission";
import firebase from "firebase/compat/app";
import {map} from "rxjs/operators";

import {Observable} from "rxjs";
import {Calendar} from "../interfaces/calendar";
import {Firestore, where} from "@angular/fire/firestore";

@Injectable({
    providedIn: 'root'
})
export class MeetingService {

    /*
     * time : TimeMeeting,
     idBusiness : string,
     idUser:string,*/
    meetingCollection: AngularFirestoreCollection<Meeting>;
    meetingCollection2: AngularFirestoreCollection<Meeting>;
    meetingCollection3: AngularFirestoreCollection<Meeting>;
    meetingCollection4: AngularFirestoreCollection<Meeting>;

    constructor(public afs: AngularFirestore) {

        this.meetingCollection = this.afs.collection('meetings');
        this.meetingCollection2 = this.afs.collection('meetings');
        this.meetingCollection4 = this.afs.collection('meetings');
        // this.meetingCollection3 = this.afs.collection('meetings',
        //     ref => ref.where('date', '==', 'hello')
        //               .where('idBusiness', '==', 'helloo')
        // );
    }

    addMeeting(meetingData: Meeting) {
        return this.meetingCollection.add(meetingData);
    }

    // add meeting with new date 2000-12-25

    /*getMeetingsByIdBusinessByDate(idBusiness: string, date: string): Observable<any> {
        // date id Business
        // reminder how to work with stream of data
        console.log(' call getMeeting with data');
        console.log(idBusiness + '   ' + date);


        this.meetingCollection2 = this.afs.collection('meetings',
            ref => {
                let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref.orderBy('nameOrganization', 'asc');

                if (date) {
                    query = query.where('date', '==', '29.12.2021');
                }

                if (idBusiness) {
                    query = query.where('idBusiness', '==', 'helloo');
                }

                return query;
            });

        return this.meetingCollection2.valueChanges();
    }*/
    // vytiahnut si akymkolvek sposobom data



    getMeetingsByIdBusinessByDate(idBusiness: string, dateForCalendar: string): Observable<Meeting[]> {

        this.meetingCollection3 = this.afs.collection('meetings',
            ref => ref.where('dateForCalendar', '==', dateForCalendar)
                      .where('idBusiness', '==', idBusiness)
        );

        return this.meetingCollection3.snapshotChanges().pipe(
            map(changes => {
                return changes.map(a => {
                    const data = a.payload.doc.data() as Meeting;
                    data.id = a.payload.doc.id;
                    return data;
                });
            }));
    }


    //todo create function for list of my Meetings
    // create page for list of my Meetings
    //
    /*getMeetingsByIdUser(idUser: string, currentDay?: string): Observable<Meeting[]> {
        console.log('funny code ');
        this.meetingCollection3 = this.afs.collection('meetings',
            ref => ref.where('idUser', '==', idUser)
                      //.limit(10)
                      .where('dateForCalendar', '>', currentDay)

            //.orderBy('date')
//                      .where('date', '>', currentDay)
            // .startAt(1)
            //  .limitToLast(5)

            //.where('date','<', '2022-2-30')
            // .where('date', '>', currentDay)
            //.startAt(2)
            //.limit(20)
            //.orderBy('minutes')
            /!* .orderBy('date')*!/
        );*/


    getMeetingsByIdUserOrderByDate(idUser:string, currentDay?:string):Observable<Meeting[]>{
        this.meetingCollection3 = this.afs.collection('meetings',
            ref => ref.where('idUser', '==', idUser)
                      //.where('date','<', '2022-2-30')

                      .where('date', '>', currentDay)
                 //     .startAt(10)
            //.startAt(2)
            //.limit(20)
            //.orderBy('minutes')
            /* .orderBy('date')*/
        );

        console.log('funny code ');

       /* this.meetingCollection3.get().subscribe(value => console.log(value)
        );
        */

      //return this.meetingCollection3.valueChanges();
      //  console.log();

        return this.meetingCollection3.snapshotChanges().pipe(
            map(changes => {
                return changes.map(a => {
                    const data = a.payload.doc.data() as Meeting;
                    data.id = a.payload.doc.id;
                    return data;
                });
            }));


    }

    /*getOneBusiness(documentId: string): Observable<Business | undefined> {
        console.log('function getOneBusiness document  ' +  documentId);

        return this.businessCollection2.doc(documentId).get().pipe(
            map(changes => {

                const data = changes.data();
                data.id = documentId;
                return data;

            }));

    }*/

    getOneMeeting(documentId:string): Observable<Meeting> {
        //return this.meetingCollection2.doc('6p4hV0ozXqFPLC5c2IDe').valueChanges();
        return this.meetingCollection2.doc(documentId).valueChanges();

    }



    getMeetingsByIdBusiness(idBusiness:string):Observable<Meeting[]>{
        this.meetingCollection3 = this.afs.collection('meetings',
            ref => ref.where('idBusiness', '==', idBusiness)
        );

        return this.meetingCollection3.valueChanges();
    }

    deleteMeeting(docIdMeeting: string): Promise<void> {

        return this.meetingCollection4.doc(docIdMeeting).delete();
    }

// ' ' + item.idBusiness + ' ' + item.idUser + ' ' + item.time.start
// todo meeting po uplinuti datumu by sa mali vymazat a uz neukazovat premysliet tox
}
