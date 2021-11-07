import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, DocumentReference} from "@angular/fire/compat/firestore";
import {Calendar} from "../interfaces/calendar";
import {Business} from "../interfaces/business";
import {BusinessPermission} from "../interfaces/businessPermission";

@Injectable({
  providedIn: 'root'
})
export class CalendarService {


  calendarCollection: AngularFirestoreCollection<Calendar>;

  constructor(public afs: AngularFirestore) {
    this.calendarCollection = this.afs.collection('calendar');

  }

  //addCalendar(calendarData: Business): Promise<DocumentReference<BusinessPermission>> {
  addCalendar(calendarData: Calendar): any {

    return this.calendarCollection.add(calendarData);


  }
}
