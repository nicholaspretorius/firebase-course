import { Injectable } from '@angular/core';
import {Observable, of} from "rxjs";
import {first, map} from "rxjs/operators";
import {AngularFirestore} from "@angular/fire/firestore";

import {Course} from "../model/course";
import {convertSnapshots} from "./db-utils";
import {Lesson} from "../model/lesson";
import OrderByDirection = firebase.firestore.OrderByDirection;
import {Form} from "@angular/forms";

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

  getLessons(courseId: string, sortOrder: OrderByDirection = 'asc', pageNumber = 0, pageSize = 3): Observable<Lesson[]> {
    return this.db.collection(`courses/${courseId}/lessons`,
        ref => ref
          .orderBy('seqNo', sortOrder)
          .limit(pageSize)
          .startAfter(pageNumber * pageSize))
      .snapshotChanges()
      .pipe(
        map(snaps => convertSnapshots<Lesson>(snaps)),
        first()
      );
  }

  updateCourse(courseId: string, updates: Partial<Course>): Observable<any> {
    console.log('CourseId:', courseId, 'Changes: ', updates);
    return of(this.db.doc(`courses/${courseId}`).update(updates));
  }
}
