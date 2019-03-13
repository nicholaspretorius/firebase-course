import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {first, map} from "rxjs/operators";
import {AngularFirestore} from "@angular/fire/firestore";

import {Course} from "../model/course";
import {convertSnapshots} from "./db-utils";

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  constructor(private db: AngularFirestore) { }

  getCourses(): Observable<Course[]> {
    return this.db.collection(
      'courses',
        ref => ref.orderBy('seqNo'))
      .snapshotChanges()// .valueChanges()
      .pipe(
        map(snaps => convertSnapshots<Course>(snaps)),
        first()
      );
  }

  getCourseByUrl(courseUrl: string): Observable<Course> {
   return this.db.collection('courses', ref => ref.where('url', '==', courseUrl))
     .snapshotChanges()
     .pipe(
       map(snaps => {
         const courses = convertSnapshots<Course>(snaps);

         // if more than one result is found, course is not unique
         return courses.length === 1 ? courses[0] : undefined;
       }),
       first()
     );
  }
}
