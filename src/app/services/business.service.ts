import {Injectable} from '@angular/core';
import {AngularFireDatabase, AngularFireList, AngularFireObject} from '@angular/fire/compat/database';
import {Business} from "../interfaces/business";
import {FormGroup} from "@angular/forms";

//import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import {Observable} from "rxjs";
import {map} from 'rxjs/operators';
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


    typesOfOrganization = [
        {name: "Health Care"},
        {name: "Food/Restaurant"},
        {name: "Transport"},
        {name: "Financial Services"},
        {name: "Wellness & Personal Grooming"},
        {name: "Sports & Fitness"},
    ];


    ref: any;

    constructor(public afs: AngularFirestore,
                public afAuth: AngularFireAuth) {
        //this.items = this.afs.collection('items').valueChanges();
        this.idUser = localStorage.getItem('idUser');
        console.log('your user id is ' + this.idUser);

        this.itemsCollection = this.afs.collection('items', ref => ref.orderBy('name', 'asc'));
        //  this.businessCollection = this.afs.collection('business', ref => ref.orderBy('name','asc'));
        this.businessCollection = this.afs.collection('business');
        //this.businessPermissionCollection= this.afs.collection('businessPermission', ref => ref.orderBy('idUser','asc'));
        this.businessPermissionCollection = this.afs.collection('businessPermission');

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

    getNewBusiness(): Observable<unknown[]> {
        return this.afs.collection('businessPermission',
            ref => ref.orderBy('city', 'asc'))
            .valueChanges();
    }


    addBusiness(businessData: Business): any {
        // return this.businessCollection.add(businessData);
        return this.businessCollection.add(businessData).then(value => {

            let businessPermissionObject: BusinessPermission = {
                idUser: localStorage.getItem('idUser'),
                idOrganization: value.id,
            };

           return this.addBusinessPermission(businessPermissionObject).then(value => {
               console.log('-------------------------------');
               console.log("save into businessPermission ");
               console.log('id businessPermission' + value.id);

             //  this.createdNewBusiness = true;
              // this.router.navigate(['/create-calendar', {createdBusiness: true}]);
           })
        });

        /*
        * .then(value => {
                console.log("save Into business successfully done");
                console.log('ID business organization' + value.id);

                let businessPermissionObject:BusinessPermission = {
                    idUser: localStorage.getItem('idUser'),
                    idOrganization: value.id,
                };

                this.businessService.addBusinessPermission(businessPermissionObject).then(value => {
                    console.log('-------------------------------');
                    console.log("save into businessPermission ");
                    console.log('id businessPermission' + value.id);

                    this.createdNewBusiness = true;
                    this.router.navigate(['/create-calendar', {createdBusiness: true}]);
                }).catch((error) => {
                    console.log(error);
                    //todo delete from organization
                    //todo create message for not saving data
                });*/

    }
        // otypovat todo
    addBusinessPermission(businessPermissionObject: BusinessPermission) {
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
