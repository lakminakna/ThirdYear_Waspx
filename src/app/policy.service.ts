import { Injectable } from '@angular/core';


import { AngularFirestore } from '@angular/fire/firestore';
import { Policy } from './policy.model';
import { BarDetails } from './policy.model';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class PolicyService {

  public data;
  private dbPath = '/sensorData/history';
  private dbBar = '/sensorData/1';

  customersRef: AngularFireList<Policy> = null;
  BarRef: AngularFireList<BarDetails> = null;

  constructor(
    private db: AngularFireDatabase,
    private firestore: AngularFirestore
  ) {
    this.customersRef = db.list(this.dbPath);
    this.BarRef = db.list(this.dbBar);
    // this.getPolicies() 
  }

  getPolicies() {
    this.data = this.firestore.collection('waspx-d2876').snapshotChanges();
    console.log(this.data);
  }

  getCustomersList(): AngularFireList<Policy> {
    return this.customersRef;
  }

  getBarDetails(): AngularFireList<BarDetails> {
    return this.BarRef;
  }
}
