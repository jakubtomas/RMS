import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from "@angular/fire/compat/firestore";
import { Calendar } from "../interfaces/calendar";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  //https://ionicframework.com/docs/
  calendarCollection: AngularFirestoreCollection<Calendar>;
  calendarCollection2: AngularFirestoreCollection<Calendar>;
  calendarCollection3: AngularFirestoreCollection<Calendar>;
  calendarCollection4: AngularFirestoreCollection<Calendar>;

  constructor(public afs: AngularFirestore) {
    this.calendarCollection = this.afs.collection('calendar',
      ref => ref.orderBy('idBusiness', 'asc'));
    this.calendarCollection2 = this.afs.collection('calendar');
    this.calendarCollection3 = this.afs.collection('calendar');

    this.calendarCollection4 = this.afs.collection('calendar',
      ref => ref.orderBy('idBusiness', 'asc'));
  }

  //addCalendar(calendarData: Business): Promise<DocumentReference<BusinessPermission>> {
  addCalendar(calendarData: Calendar): Promise<DocumentReference<Calendar>> {

    return this.calendarCollection3.add(calendarData);
  }

  getCalendars(): Observable<Calendar[]> {
    return this.calendarCollection4.snapshotChanges().pipe(
      map(changes => {
        return changes.map(a => {
          const data = a.payload.doc.data() as Calendar;
          data.id = a.payload.doc.id;
          return data;
        });
      }));
  }

  /*getAllBusinesses(): Observable<Business[]> {
   return this.businessCollection2.snapshotChanges().pipe(
   map(changes => {
   return changes.map(a => {
   const data = a.payload.doc.data() as Business;
   data.id = a.payload.doc.id;
   // this.businessesData.push(data);
   return data;
   });
   }));
   }*/




  //getOneCalendar According to id Business
  getOpeningHoursByIdBusiness(idBusiness: string) {
    this.calendarCollection = this.afs.collection('calendar',
      ref => ref.where('idBusiness', '==', idBusiness));

    return this.calendarCollection.valueChanges();
  }

  //getOne Calendar according to doc id Calendar
  getOneCalendar(documentId: string): Observable<Calendar> {
    return this.calendarCollection.doc(documentId).valueChanges();
  }

  updateCalendar(docCalendarId: string, calendarData: Calendar): Promise<void> {
    console.log("docCalendarId:string" + docCalendarId);
    console.log(" calendar data " + calendarData);
    return this.calendarCollection2.doc(docCalendarId).update(calendarData);
  }

  deleteCalendar(docIdCalendar: string): Promise<void> {
    return this.calendarCollection2.doc(docIdCalendar).delete();
  }
}


