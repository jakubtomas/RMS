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

    constructor(public afs: AngularFirestore) {

        this.meetingCollection = this.afs.collection('meetings');
        this.meetingCollection2 = this.afs.collection('meetings');
        // this.meetingCollection3 = this.afs.collection('meetings',
        //     ref => ref.where('date', '==', 'hello')
        //               .where('idBusiness', '==', 'helloo')
        // );
    }

    addMeeting(meetingData: Meeting) {
        return this.meetingCollection.add(meetingData);
    }

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


    getOneMeeting(): Observable<Meeting> {
        return this.meetingCollection2.doc('6p4hV0ozXqFPLC5c2IDe').valueChanges();
    }

    getMeetingsByIdBusinessByDate(idBusiness: string, date: string): Observable<Meeting[]> {

        this.meetingCollection3 = this.afs.collection('meetings',
            ref => ref.where('date', '==', date)
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
    getMeetingsByIdUser(idUser:string):Observable<Meeting[]>{
        this.meetingCollection3 = this.afs.collection('meetings',
            ref => ref.where('idUser', '==', idUser)
        );

        return this.meetingCollection3.valueChanges();
    }




}
