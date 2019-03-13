import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {first, map} from "rxjs/operators";
import {AngularFirestore} from "@angular/fire/firestore";

import {Course} from "../model/course";

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  constructor(private db: AngularFirestore) { }

  getCourses(): Observable<Course[]> {
    return this.db.collection('courses')
      .snapshotChanges()// .valueChanges()
      .pipe(
        map(snaps => {
          return snaps.map(snap => {
            return <Course> {
              id: snap.payload.doc.id,
              ...snap.payload.doc.data()
            }
          })
      }), first());
  }
}
