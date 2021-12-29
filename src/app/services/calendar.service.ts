import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, DocumentReference} from "@angular/fire/compat/firestore";
import {Calendar} from "../interfaces/calendar";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {Business} from "../interfaces/business";

@Injectable({
    providedIn: 'root'
})
export class CalendarService {

    calendarCollection: AngularFirestoreCollection<Calendar>;
    calendarCollection2: AngularFirestoreCollection<Calendar>;

    constructor(public afs: AngularFirestore) {
        this.calendarCollection = this.afs.collection('calendar',
                ref => ref.orderBy('idBusiness', 'asc'));
        this.calendarCollection2 = this.afs.collection('calendar' );

    }

    //addCalendar(calendarData: Business): Promise<DocumentReference<BusinessPermission>> {
    addCalendar(calendarData: Calendar): Promise<DocumentReference<Calendar>> {
        console.log(" problem here");
        return this.calendarCollection.add(calendarData);
    }

    getCalendars(): Observable<Calendar[] > {
        return this.calendarCollection.snapshotChanges().pipe(
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
    getOneCalendarByIdBusiness(idBusiness: string) {
        this.calendarCollection = this.afs.collection('calendar',
                ref => ref.where('idBusiness','==' , idBusiness));

        return this.calendarCollection.valueChanges();
    }

    //getOne Calendar according to doc id Calendar
    getOneCalendar(documentId: string): Observable<Calendar> {
        return this.calendarCollection.doc(documentId).valueChanges();
    }

    updateCalendar(docCalendarId:string, calendarData: Calendar): Promise<void> {
        console.log("docCalendarId:string" + docCalendarId);
        console.log(" calendar data " + calendarData);
        return this.calendarCollection2.doc(docCalendarId).update(calendarData);
    }

    deleteCalendar(docIdCalendar: string): Promise<void> {
        return this.calendarCollection2.doc(docIdCalendar).delete();
}
}


