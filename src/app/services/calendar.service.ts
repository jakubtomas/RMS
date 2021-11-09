import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, DocumentReference} from "@angular/fire/compat/firestore";
import {Calendar} from "../interfaces/calendar";
import {Business} from "../interfaces/business";
import {BusinessPermission} from "../interfaces/businessPermission";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {error} from "selenium-webdriver";

@Injectable({
    providedIn: 'root'
})
export class CalendarService {

    calendarCollection: AngularFirestoreCollection<Calendar>;

    constructor(public afs: AngularFirestore) {
        this.calendarCollection = this.afs.collection('calendar', ref => ref.orderBy('nameCalendar', 'asc'));

    }

    //addCalendar(calendarData: Business): Promise<DocumentReference<BusinessPermission>> {
    addCalendar(calendarData: Calendar): Promise<DocumentReference<Calendar>> {
        return this.calendarCollection.add(calendarData);
    }

    getCalendars(): Observable<Calendar[] | undefined> {
        return this.calendarCollection.snapshotChanges().pipe(
            map(changes => {
                return changes.map(a => {
                    const data = a.payload.doc.data() as Calendar;
                    data.id = a.payload.doc.id;
                    return data;
                });
            }));
    }

    getOneCalendar(documentId: string): Observable<Calendar> {
        return this.calendarCollection.doc(documentId).valueChanges();
    }

    updateCalendar(docCalendarId:string, calendarData: Calendar): Promise<void> {
        return this.calendarCollection.doc(docCalendarId).update(calendarData);
    }
}

