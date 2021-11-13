import {Injectable} from '@angular/core';
import {AngularFireDatabase, AngularFireList, AngularFireObject} from '@angular/fire/compat/database';
import {Business} from "../interfaces/business";
import {FormGroup} from "@angular/forms";

//import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import {BehaviorSubject, Observable, Subject, Subscriber} from "rxjs";
import {map} from 'rxjs/operators';
import {

    Action,
    AngularFirestore,
    AngularFirestoreCollection,
    AngularFirestoreDocument,
    DocumentChangeAction,
    DocumentSnapshot
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
    businessCollection2: AngularFirestoreCollection<Business>;
    businessPermissionCollection: AngularFirestoreCollection<BusinessPermission>;

    itemDoc: AngularFirestoreDocument<Item>;

    idUser: string = '';
    items: Observable<Item[]>;

    typesOfOrganization = [
        {name: "Health Care"},
        {name: "Food/Restaurant"},
        {name: "Transport"},
        {name: "Financial Services"},
        {name: "Wellness & Personal Grooming"},
        {name: "Sports & Fitness"},
    ];


    constructor(public afs: AngularFirestore,
        public afAuth: AngularFireAuth) {
        //this.items = this.afs.collection('items').valueChanges();
        this.idUser = localStorage.getItem('idUser');
        console.log('your user id is ' + this.idUser);

        this.itemsCollection = this.afs.collection('items', ref => ref.orderBy('name', 'asc'));
         // this.businessCollection = this.afs.collection('business', ref => ref.orderBy('name','asc'));
         this.businessCollection2 = this.afs.collection('business');
        //this.businessPermissionCollection= this.afs.collection('businessPermission', ref => ref.orderBy('idUser','asc'));
        this.businessPermissionCollection = this.afs.collection('businessPermission');

    }

    //todo repeat the same code , create the function
    getItems(): Observable<Item[]> {
        return this.items = this.itemsCollection.snapshotChanges().pipe(
            map(changes => {
                return changes.map(a => {
                    const data = a.payload.doc.data() as Item;
                    data.id = a.payload.doc.id;
                    return data;
                });
            }));
    }

    getAllBusinesses(): Observable<Business[]> {
        return this.businessCollection2.snapshotChanges().pipe(
            map(changes => {
                return changes.map(a => {
                    const data = a.payload.doc.data() as Business;
                    data.id = a.payload.doc.id;
                    // this.businessesData.push(data);
                    return data;
                });
            }));
    }

    getOneBusiness(documentId: string): Observable<Business> {
        console.log(documentId);
        
        return this.businessCollection2.doc(documentId).valueChanges();
    }


    addBusiness(businessData: Business): Promise<DocumentReference<BusinessPermission>> {
        //todo add typ then value

        console.log(JSON.stringify(businessData));

        return this.businessCollection2.add(businessData).then((value) => {

            let businessPermissionObject: BusinessPermission = {
                idUser: localStorage.getItem('idUser'),
                idOrganization: value.id,
            };

            return this.addBusinessPermission(businessPermissionObject);
        });
    }

    updateBusiness(businessData: Business, businessId: string): Promise<void> {
        return this.businessCollection2.doc(businessId).update(businessData);
    }

    deleteBusiness(businessId: string): Promise<void> {
        return this.businessCollection2.doc(businessId).delete();

        //todo important delete also in another table in firestroe do not forget this
    }

    addBusinessPermission(businessPermissionObject: BusinessPermission): Promise<DocumentReference<BusinessPermission>> {
        return this.businessPermissionCollection.add(businessPermissionObject);
    }

    getBusinessList(): Observable<DocumentChangeAction<unknown>[]> {
        return this.afs
                   .collection("business")
                   .snapshotChanges();
    }


}
