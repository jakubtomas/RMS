import { Injectable } from '@angular/core';
import {AngularFireDatabase, AngularFireList, AngularFireObject} from '@angular/fire/compat/database';
import {Business} from "../interfaces/business";
import {FormGroup} from "@angular/forms";

//import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import {Observable} from "rxjs";
import { map } from 'rxjs/operators';
import {

  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  DocumentChangeAction
} from '@angular/fire/compat/firestore';
import firebase from "firebase/compat";
import DocumentReference = firebase.firestore.DocumentReference;
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {doc} from "@angular/fire/firestore";
import {BusinessPermission} from "../interfaces/businessPermission";

interface Item {
  id?: string;
  name?: string;
  age?: number;
}

@Injectable({
  providedIn: 'root'
})
export class BusinessService {

  itemsCollection: AngularFirestoreCollection<Item>;
  businessCollection: AngularFirestoreCollection<Business>;
  businessPermissionCollection: AngularFirestoreCollection<BusinessPermission>;
  items: Observable<Item[]>;
  itemDoc: AngularFirestoreDocument<Item>;

   idUser: string = '';


  typesOfOrganization:object = [
    {"name": "Health Care"},
    {"name": "Food/Restaurant"},
    {"name": "Transport"},
    {"name": "Financial Services"},
    {"name": "Wellness & Personal Grooming"},
    {"name": "Sports & Fitness"},
];


  ref: any;

  constructor(public afs: AngularFirestore,
              public afAuth: AngularFireAuth) {
    //this.items = this.afs.collection('items').valueChanges();
    this.idUser = localStorage.getItem('idUser');
    console.log('your user id is ' + this.idUser);

    this.itemsCollection = this.afs.collection('items', ref => ref.orderBy('name','asc'));
    //  this.businessCollection = this.afs.collection('business', ref => ref.orderBy('name','asc'));
    this.businessCollection = this.afs.collection('business');
    //this.businessPermissionCollection= this.afs.collection('businessPermission', ref => ref.orderBy('idUser','asc'));
    this.businessPermissionCollection= this.afs.collection('businessPermission');

  //  this.ref = this.afs.collection()

  }

  getItems(): Observable<Item[]> {
    return this.items = this.itemsCollection.snapshotChanges().pipe(
        map(changes => {
          return changes.map(a => {
            const data = a.payload.doc.data() as Item;
            data.id = a.payload.doc.id;
            return data;
          });
        }));

    //return this.items
  }

  getNewBusiness():Observable<unknown[]> {
    return this.afs.collection('businessPermission',
        ref => ref.orderBy('city','asc'))
        .valueChanges();
  }



  addBusiness(businessData: Business): Promise<DocumentReference<Business>>{
    return this.businessCollection.add(businessData);
  }

  addBusinessPermission(businessPermissionObject :BusinessPermission) {
    return this.businessPermissionCollection.add(businessPermissionObject);
  }

  getBusinessList(): Observable<DocumentChangeAction<unknown>[]> {
    return this.afs
        .collection("business")
        .snapshotChanges();
  }

  deleteItem(item: Item){
    this.itemDoc = this.afs.doc(`items/${item.id}`);
    this.itemDoc.delete();
  }

  updateItem(item: Item){
    this.itemDoc = this.afs.doc(`items/${item.id}`);
    this.itemDoc.update(item);
  }

}
