import {Injectable, Query} from '@angular/core';
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
import {SearchBusiness} from "../interfaces/searchBusiness";
import {user} from "@angular/fire/auth";

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
    isActiveMode: boolean = false;

    private orderBy: string = 'nameOrganization';

    private oneUserBusinesses;

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

        this.itemsCollection = this.afs.collection('items',
            ref => ref.orderBy('name', 'asc'));
        // this.businessCollection = this.afs.collection('business', ref => ref.orderBy('name','asc'));

        //citiesRef.where('population', '>', 2500000).orderBy('population');

        this.businessCollection = this.afs.collection('business',
            ref => ref.where('typeOfOrganization', '==', 'Transport')
        );


        this.businessCollection2 = this.afs.collection('business');
        //this.businessPermissionCollection= this.afs.collection('businessPermission', ref => ref.orderBy('idUser','asc'));
        this.businessPermissionCollection = this.afs.collection('businessPermission');

        //afs.collection('items', ref => ref.where('size', '==', 'large'))


    }

    // changeOrderBy(orderBy: string):void{
    //     this.orderBy = orderBy;
    // }

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

    setOrderBy(orderBy: string) {

        if (orderBy === "nameOrganization") {
            this.businessCollection = this.afs.collection('business',
                ref => ref.orderBy('nameOrganization', "asc"));

        } else {
            this.businessCollection = this.afs.collection('business',
                ref => ref.orderBy('city', "asc"));

        }


    }

    getSearchedBusinesses(searchValues: SearchBusiness): Observable<Business[]> {

        this.businessCollection = this.afs.collection('business',
            ref => {
                let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
                if (searchValues.nameOrganization) {
                    query = query.where('nameOrganization', '==', searchValues.nameOrganization)
                }
                if (searchValues.city) {
                    query = query.where('city', '==', searchValues.city)
                }

                if (searchValues.zipCode) {
                    query = query.where('zipCode', '==', searchValues.zipCode)
                }

                if (searchValues.typeOfOrganization) {
                    query = query.where('typeOfOrganization', '==', searchValues.typeOfOrganization)
                }

                //return query.orderBy('city', 'asc');
                return query;
            });

        return this.businessCollection.valueChanges();
    }


    /// 1 create function set value , parameter
    //todo reminder change orderBY ? because search page , set parameter

    getAllBusinesses(orderBy: string): Observable<Business[]> {
        return this.businessCollection.snapshotChanges().pipe(
            map(changes => {
                return changes.map(a => {
                    const data = a.payload.doc.data() as Business;
                    data.id = a.payload.doc.id;
                    return data;
                });
            }));
    }

    getOneBusiness(documentId: string): Observable<Business | undefined> {
        console.log(documentId);

        return this.businessCollection2.doc(documentId).valueChanges();
      //  return this.businessCollection2.doc(documentId);
    }
    getBusinessPermission(): Observable<BusinessPermission[]> {
        return this.businessPermissionCollection.valueChanges();
    }

    getOneBusinessDemo(documentId: string)/*: Observable<Business>*/ {

        const userId = localStorage.getItem('idUser');

        this.getBusinessPermission().subscribe(permissions => {

            //filter only my businesses
            const myBusinesses = permissions.filter(permission => permission.idUser == userId);

            console.log(myBusinesses);

            // for every id myBusiness I am calling function which return my Document with detail Information
            myBusinesses.forEach(one => {

                let resultDocument = this.businessCollection2.doc(one.idOrganization).valueChanges();

                resultDocument.subscribe(document => {
                    console.log("result ");
                    if (document !== undefined) {
                        console.log(document);
                    }
                })
            });
            const result =  this.businessCollection2.doc(myBusinesses[0].idOrganization).valueChanges();

            // result.subscribe(document => {
            //     console.log("dostanem hodnotu");
            //
            //     console.log(document);
            //
            // });
            // add error

        }); // add error


        //const arrayBusinesses = ["tH5C1FCYzAMlGttUOQNG", "3Sr8RHAx3dLGfKsxw5eg"];
        const arrayBusinesses = ["tH5C1FCYzAMlGttUOQNG", "3Sr8RHAx3dLGfKsxw5eg","TXYWmaBy0gxMFJuJhaXj"];
        //const arrayBusinesses = ["3x9djdyxErliKZ2V1MCA", "tH5C1FCYzAMlGttUOQNG"];

        // const result =  this.businessCollection2.doc(arrayBusinesses[0]).valueChanges();
        //
        // result.subscribe(document => {
        //     console.log("preco neides");
        //
        //     console.log(document);
        //
        // });
        // what happen when document does not exist

        // arrayBusinesses.forEach(one => {
        //     console.log("one is " + one);
        //
        //     let result = this.businessCollection2.doc(one).valueChanges();
        //
        //     result.subscribe(value => {
        //         console.log("vysledok ");
        //         console.log(value);
        //
        //     })
        // });

        console.log("result one business");
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


    getAllOwnerBusinesses():void {
        /*const userId = localStorage.getItem('idUser');

        this.getBusinessPermission().subscribe(permissions => {

           // console.log(permissions);
            const myBusinesses = permissions.filter(permission => permission.idUser == userId);
            console.log(' permissions');

            console.log(myBusinesses);
            
            this.oneUserBusinesses = myBusinesses;
           // console.log(myBusinesses);

        });*/
    }

    getBusinessList(): Observable<DocumentChangeAction<unknown>[]> {
        return this.afs
                   .collection("business")
                   .snapshotChanges();
    }


}
