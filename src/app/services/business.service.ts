/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { Business } from '../interfaces/business';
//import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { BehaviorSubject, forkJoin, Observable, Subject } from 'rxjs';
import { filter, map, mergeMap, switchMap, tap, toArray } from 'rxjs/operators';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  DocumentChangeAction,
  Query,
} from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import DocumentReference = firebase.firestore.DocumentReference;
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BusinessPermission } from '../interfaces/businessPermission';
import { SearchBusiness } from '../interfaces/searchBusiness';

interface Item {
  id?: string;
  name?: string;
  age?: number;
}

@Injectable({
  providedIn: 'root',
})
export class BusinessService {
  itemsCollection: AngularFirestoreCollection<Item>;
  businessCollection: AngularFirestoreCollection<Business>;
  businessCollection2: AngularFirestoreCollection<Business>;
  businessCollection3: AngularFirestoreCollection<Business>;
  businessPermissionCollection: AngularFirestoreCollection<BusinessPermission>;

  itemDoc: AngularFirestoreDocument<Item>;

  idUser = '';
  items: Observable<Item[]>;
  isActiveMode = false;

  private orderBy = 'nameOrganization';

  public oneUserBusinesses = [];

  subject$ = new Subject();

  public businessSubject = new BehaviorSubject(false);
  businessMode$ = this.businessSubject.asObservable();

  updateBusinessMode(newValue: boolean) {
    this.businessSubject.next(newValue);
  }

  typesOfOrganization = [
    { name: 'Health Care' },
    { name: 'Food/Restaurant' },
    { name: 'Transport' },
    { name: 'Financial Services' },
    { name: 'Wellness & Personal Grooming' },
    { name: 'Sportss & Fitness' },
  ];

  constructor(public afs: AngularFirestore, public afAuth: AngularFireAuth) {
    this.idUser = localStorage.getItem('idUser');

    this.itemsCollection = this.afs.collection('items', (ref) =>
      ref.orderBy('name', 'asc')
    );

    this.businessCollection = this.afs.collection('business');

    this.businessCollection2 = this.afs.collection('business');
    this.businessPermissionCollection =
      this.afs.collection('businessPermission');
  }

  getItems(): Observable<Item[]> {
    return (this.items = this.itemsCollection.snapshotChanges().pipe(
      map((changes) =>
        changes.map((a) => {
          const data = a.payload.doc.data() as Item;
          data.id = a.payload.doc.id;
          return data;
        })
      )
    ));
  }

  setOrderBy(orderBy: string) {
    if (orderBy === 'nameOrganization') {
      this.businessCollection = this.afs.collection('business', (ref) =>
        ref.orderBy('nameOrganization', 'asc')
      );
    } else {
      this.businessCollection = this.afs.collection('business', (ref) =>
        ref.orderBy('city', 'asc')
      );
    }
  }

  getBusinessPermission(idBusiness: string): Observable<BusinessPermission> {
    const businessPermissionCollection: AngularFirestoreCollection<BusinessPermission> =
      this.afs.collection('businessPermission', (ref) => {
        let query:
          | firebase.firestore.CollectionReference
          | firebase.firestore.Query = ref;

        if (idBusiness) {
          query = query.where('idOrganization', '==', idBusiness);
        }
        return query;
      });

    return businessPermissionCollection
      .valueChanges()
      .pipe(map((array) => (array?.length === 1 ? array[0] : null)));
  }

  getSearchedBusinesses(searchValues: SearchBusiness): Observable<Business[]> {
    this.businessCollection = this.afs.collection('business', (ref) => {
      let query = ref.where(
        'typeOfOrganization',
        '==',
        searchValues.typeOfOrganization
      );

      if (searchValues.city) {
        query = ref.where('city', '==', searchValues.city);
      }

      if (searchValues.nameOrganization) {
        query = query.where(
          'nameOrganization',
          '==',
          searchValues.nameOrganization
        );
      }

      if (searchValues.zipCode) {
        query = query.where('zipCode', '==', searchValues.zipCode);
      }
      return query;
    });

    return this.businessCollection.snapshotChanges().pipe(
      map((changes) =>
        changes.map((a) => {
          const data = a.payload.doc.data() as Business;
          data.id = a.payload.doc.id;

          return data;
        })
      )
    );
  }

  getBusinessPermissions(): Observable<BusinessPermission[]> {
    //Id user id organization
    return this.businessPermissionCollection.valueChanges();
  }

  getIdsOfMyBusinesses(): Observable<string[]> {
    const userId = localStorage.getItem('idUser');

    // of([1, 2]).pipe(
    //   map((value) => )
    // )

    return this.getBusinessPermissions().pipe(
      map((array: BusinessPermission[]) =>
        array.filter((permission) => permission.idUser == userId)
      ),
      map((value: BusinessPermission[]) =>
        value.map((item: BusinessPermission) => item.idOrganization)
      )
    );
  }

  getAllMyBusinesses(): Observable<Business[]> {
    this.businessCollection = this.afs.collection('business');

    return this.getIdsOfMyBusinesses().pipe(
      switchMap((idsBusinesses) =>
        forkJoin(idsBusinesses.map((id) => this.getOneBusiness(id)))
      ),
      tap(() => console.log(''))
    );
  }

  //Fork Join multiple request

  getOneBusiness(documentId: string): Observable<Business | undefined> {
    if (documentId === undefined) {
      return undefined;
    }

    return this.businessCollection2
      .doc(documentId)
      .get()
      .pipe(
        map((changes) => {
          const data = changes.data();
          if (data === undefined) {
            const mockObject = {
              id: '',
              idOwner: '',
              nameOrganization: '',
              phoneNumber: '',
              zipCode: '',
              city: '',
              nameStreetWithNumber: '',
              typeOfOrganization: '',
            };
            return mockObject;
          } else {
            data.id = documentId;
            return data;
          }
        })
      );
  }

  async addBusiness(
    businessData: Business
  ): Promise<DocumentReference<BusinessPermission>> {
    const value = await this.businessCollection2.add(businessData);

    const businessPermissionObject: BusinessPermission = {
      idUser: localStorage.getItem('idUser'),
      idOrganization: value.id,
    };

    return await this.addBusinessPermission(businessPermissionObject);
  }

  updateBusiness(businessData: Business, businessId: string): Promise<void> {
    return this.businessCollection2.doc(businessId).update(businessData);
  }

  deleteBusiness(businessId: string): Promise<void> {
    return this.businessCollection2.doc(businessId).delete();
  }

  addBusinessPermission(
    businessPermission: BusinessPermission
  ): Promise<DocumentReference<BusinessPermission>> {
    return this.businessPermissionCollection.add(businessPermission);
  }

  getBusinessList(): Observable<DocumentChangeAction<unknown>[]> {
    return this.afs.collection('business').snapshotChanges();
  }
}
