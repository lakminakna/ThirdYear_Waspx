import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { BasicDashboardDetailsModel } from '../charts/charts.model';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';



@Injectable({
  providedIn: 'root'
})
export class LineChartService {

  private BasicDashboardDetailsDbPath = '/sensorData';
  DashboardDetailsRef: AngularFireList<BasicDashboardDetailsModel> = null;

  constructor(
    private db: AngularFireDatabase,
    private firestore: AngularFirestore
 ) { 
  this.DashboardDetailsRef = db.list(this.BasicDashboardDetailsDbPath);
 }


getBasicDashboardDetails (): AngularFireList<BasicDashboardDetailsModel> {
  return this.DashboardDetailsRef;
}
}