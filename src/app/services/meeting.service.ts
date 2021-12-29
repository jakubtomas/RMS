import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {Business} from "../interfaces/business";
import {Meeting} from "../interfaces/meeting";
import {BusinessPermission} from "../interfaces/businessPermission";

@Injectable({
  providedIn: 'root'
})
export class MeetingService {

/*
* time : TimeMeeting,
 idBusiness : string,
 idUser:string,*/
  meetingCollection: AngularFirestoreCollection<Meeting>;


  constructor(public afs: AngularFirestore) {

    this.meetingCollection = this.afs.collection('meeting');

  }


  addMeeting(meetingData:Meeting){
    return this.meetingCollection.add(meetingData).then((value) => {



    });
  }



}
