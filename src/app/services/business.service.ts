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
    businessPermissionCollection: AngularFirestoreCollection<BusinessPermission>;

    itemDoc: AngularFirestoreDocument<Item>;

    idUser: string = '';
    items: Observable<Item[]>;

    //todo delete this
    businesses: Observable<Business[]>;

    // todo vyfiltrovat data
    businessesData: Business[] = [];

/*
    private _businessesSubscriber: Subscriber<Business>;

    getBusinessObservable(bussinessId:string):Observable<Business> {
        return new Observable(subscriber => {
            this._businessesSubscriber = subscriber;
            subscriber.next(this.getOneBusiness(bussinessId));
        })
    }

    getOneBusiness(id :string) : Business{
        return this.businessesData.filter(value => value.id === id)[0];
    }
*/
    business$:  Subject<Business>;
    businessObservable: Observable<Business>;
    //businessBehavior$: BehaviorSubject<boolean>;

    setBusiness$(business: any) {
        console.log('nastavenie hodnoty business ');
       // this.businessBehavior$.next(true);
        this.business$.next(business);
    }

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
        //  this.businessCollection = this.afs.collection('business', ref => ref.orderBy('name','asc'));
        this.businessCollection = this.afs.collection('business',ref => ref.orderBy('nameOrganization', 'asc'));
        //this.businessPermissionCollection= this.afs.collection('businessPermission', ref => ref.orderBy('idUser','asc'));
        this.businessPermissionCollection = this.afs.collection('businessPermission');

        //  this.ref = this.afs.collection()

    }
        //todo opakuje sa tu kode create the function
    getItems(): Observable<Item[]> {
        return this.items = this.itemsCollection.snapshotChanges().pipe(
            map(changes => {
                return changes.map(a => {
                    const data = a.payload.doc.data() as Item;
                    data.id = a.payload.doc.id;
                    return data;
                });
            }));

        //return this.items00
    }

    getAllBusinesses():Observable<Business[]> {
        return  this.businessCollection.snapshotChanges().pipe(
            map(changes => {
                return   changes.map(a => {
                    const data = a.payload.doc.data() as Business;
                    data.id = a.payload.doc.id;
                   // this.businessesData.push(data);
                    return data;
                });
            }));
    }

    getOneBusiness(documentId: string): Observable<Business> {
        //this.afs.doc("business/3x9djdyxErliKZ2V1MCA");
        //this.setBusiness$('hello');

        return this.businessObservable = this.businessCollection.doc(documentId).valueChanges();

    }



    getNewBusiness(): Observable<unknown[]> {
        return this.afs.collection('businessPermission',
            ref => ref.orderBy('city', 'asc'))
            .valueChanges()
    }

    addBusiness(businessData: Business): Promise<DocumentReference<BusinessPermission>> {
        //todo add typ then value
        return this.businessCollection.add(businessData).then((value) => {

            let businessPermissionObject: BusinessPermission = {
                idUser: localStorage.getItem('idUser'),
                idOrganization: value.id,
            };

            return this.addBusinessPermission(businessPermissionObject);
        });
    }

    addBusinessPermission(businessPermissionObject: BusinessPermission): Promise<DocumentReference<BusinessPermission>> {
        console.log('ulozenie do druhe tabulkz ');

        return this.businessPermissionCollection.add(businessPermissionObject);
    }

    getBusinessList(): Observable<DocumentChangeAction<unknown>[]> {
        return this.afs
            .collection("business")
            .snapshotChanges();
    }

    deleteItem(item: Item) {
        this.itemDoc = this.afs.doc(`items/${item.id}`);
        this.itemDoc.delete();
    }

    updateItem(item: Item) {
        this.itemDoc = this.afs.doc(`items/${item.id}`);
        this.itemDoc.update(item);
    }

}
