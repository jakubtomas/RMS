import {Injectable} from '@angular/core';
import {Business} from "../interfaces/business";
//import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import {BehaviorSubject, Observable, of, Subject, Subscriber} from "rxjs";
import {map} from 'rxjs/operators';
import {
    AngularFirestore,
    AngularFirestoreCollection,
    AngularFirestoreDocument,
    DocumentChangeAction,
} from '@angular/fire/compat/firestore';
import firebase from "firebase/compat/app";
import DocumentReference = firebase.firestore.DocumentReference;
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {BusinessPermission} from "../interfaces/businessPermission";
import {SearchBusiness} from "../interfaces/searchBusiness";
import {getIdTokenResult} from "@angular/fire/auth";


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

    public oneUserBusinesses = [];

    subject$ = new Subject();

    typesOfOrganization = [
        {name: "Health Care"},
        {name: "Food/Restaurant"},
        {name: "Transport"},
        {name: "Financial Services"},
        {name: "Wellness & Personal Grooming"},
        {name: "Sportss & Fitness"},
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

        this.businessCollection = this.afs.collection('business');


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

    getBusinessPermission(idBusiness: string): Observable<BusinessPermission[]> {
        this.businessPermissionCollection = this.afs.collection('businessPermission',
            ref => {
                let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
                if (idBusiness) {
                    query = query.where('idOrganization', '==', idBusiness)
                }

                return query;
            });

        return this.businessPermissionCollection.valueChanges();
    }

    getSearchedBusinesses(searchValues: SearchBusiness): Observable<Business[]> {

        this.businessCollection = this.afs.collection('business',
            ref => {
                let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
                if (searchValues.nameOrganization) {
                    query = query.where('nameOrganization', '==', searchValues.nameOrganization)
                }
                if (searchValues.city) { //todo >= start with
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

        return this.businessCollection.snapshotChanges().pipe(
            map(changes => {
                return changes.map(a => {
                    const data = a.payload.doc.data() as Business;
                    data.id = a.payload.doc.id;
                    return data;
                });
            }));
    }


    /// 1 create function set value , parameter
    //todo reminder change orderBY ? because search page , set parameter

    /* getAllMyBusinesses(orderBy: string): Observable<Business[]> {
     const idOwner = localStorage.getItem('idUser');
     this.businessCollection = this.afs.collection('business',
     ref => ref.where('idOwner', '==', idOwner)
     );


     return this.businessCollection.snapshotChanges().pipe(
     map(changes => {
     return changes.map(a => {
     const data = a.payload.doc.data() as Business;
     data.id = a.payload.doc.id;
     return data;
     });
     }));
     }*/

    getIdsOfMyBusinesses() {
        const userId = localStorage.getItem('idUser');
        console.log('show my my ide ' + userId);

        let myBusinesses: BusinessPermission[];
        let idMyBusinesses: string[] = [];

        // BUSINESS PERMISSIONS
        this.getBusinessPermissions().subscribe(permissions => {

            myBusinesses = permissions.filter(permission => permission.idUser == userId);
            myBusinesses.forEach((value) => {
                idMyBusinesses.push(value.idOrganization);
            });


        });

        return idMyBusinesses;
    }

    getAllMyBusinesses(orderBy: string): Observable<Business[]> {
        let idsMyBusinesses = [];
        idsMyBusinesses = this.getIdsOfMyBusinesses();
        console.log(idsMyBusinesses);

        if (idsMyBusinesses.length > 0) {
            this.businessCollection = this.afs.collection('business',
                ref => ref.where(firebase.firestore.FieldPath.documentId(), 'in', idsMyBusinesses));

            return this.businessCollection.snapshotChanges().pipe(
                map(changes => {
                    return changes.map(a => {
                        const data = a.payload.doc.data() as Business;
                        data.id = a.payload.doc.id;
                        return data;
                    });
                }));

        }
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


    // create collection for permission businesse write condition where businesses is
    // create function and

    getBusinessPermissions(): Observable<BusinessPermission[]> {
        return this.businessPermissionCollection.valueChanges();
    }

    getOneBusinessDemo()/*: Observable<Business>*/ {

        const userId = localStorage.getItem('idUser');

        console.log("my id is " + userId);

        this.getBusinessPermissions().subscribe(permissions => {

            //filter only my businesses
            let myBusinesses = permissions.filter(permission => permission.idUser == userId);

            console.log("after filter ");
            console.log(myBusinesses);

            // for every id myBusiness I am calling function which return my Document with detail Information


            /*myBusinesses.forEach(one => {
             console.log(one.idOrganization);

             let resultDocument = this.businessCollection2.doc(one.idOrganization).valueChanges();

             resultDocument.subscribe(document => {

             if (document !== undefined) {
             console.log("------------------");
             console.log(document);
             this.oneUserBusinesses.push(document);
             // create BehaviourSubject or subject for this
             console.log("lenght of array   " + this.oneUserBusinesses.length);
             //this.subject.next(document);
             }
             })
             });*/

        });

        //todo problem stale je subscribnute a pocuva na zmeni aj ked som na inej stranke
        // todo niekedy tam mam viac hodnot pretoze ostava s prechadajucej

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

    getAllOwnerBusinesses(): void {
        /* const userId = localStorage.getItem('idUser');

         this.getBusinessPermissions().subscribe(permissions => {

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
