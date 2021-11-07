import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, DocumentReference} from "@angular/fire/compat/firestore";
import {Calendar} from "../interfaces/calendar";
import {Business} from "../interfaces/business";
import {BusinessPermission} from "../interfaces/businessPermission";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

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

    findCalendar(selectedId: string): Observable<Calendar[]> {
        return this.calendarCollection.snapshotChanges().pipe(
            map(changes => {
                return changes.map(a => {
                    const data = a.payload.doc.data() as Calendar;
                    data.id = a.payload.doc.id;

                    if (data.idBusiness === selectedId) {
                        console.log("return true manakoasdfhas o ");
                        return data;
                    }

                });
            }));
    }

    clearData(selectedId : string){

        return this.findCalendar(selectedId).subscribe(value => {

            value.filter(value1 => value1.idBusiness  )

        },error => {
            console.log("error");

            console.log(error);

        })
    }


    // function select datat
    getOneCalendar(documentId: string): Observable<Calendar | undefined> {
        return this.calendarCollection.doc("dEIrTxdU711uqdaEh3sG").valueChanges();
    }
}
