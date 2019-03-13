import {Component, Input, OnInit} from '@angular/core';
import {Course} from "../model/course";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {AngularFirestore} from "@angular/fire/firestore";


@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    courses$: Observable<Course[]>;

    coursesBeginner$: Observable<Course[]>;
    coursesAdvanced$: Observable<Course[]>;


    constructor(private db: AngularFirestore) {}

    ngOnInit() {
      this.courses$ = this.db.collection('courses')
        .snapshotChanges()// .valueChanges()
        .pipe(map(snaps => {
         return snaps.map(snap => {
          return <Course> {
            id: snap.payload.doc.id,
            ...snap.payload.doc.data()
          }
        })
      }));

      this.coursesBeginner$ = this.courseFilter('BEGINNER');
      this.coursesAdvanced$ = this.courseFilter('ADVANCED');

    }

    public courseFilter(categoryName: string): Observable<Course[]> {
      return this.courses$.pipe(
        map(courses => courses.filter(
          course => course.categories.includes(categoryName))
        )
      );
    }

}
