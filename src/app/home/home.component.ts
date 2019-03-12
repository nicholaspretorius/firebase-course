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

  @Input()
  courses: Course[];

  coursesBeginner: Course[];
  coursesAdvanced: Course[];

    constructor(private db: AngularFirestore) {

    }

    ngOnInit() {
      this.db.collection('courses')
        .snapshotChanges()// .valueChanges()
        .subscribe(snaps => {
          this.courses = snaps.map(snap => {
            return <Course> {
              id: snap.payload.doc.id,
              ...snap.payload.doc.data()
            }
          })

          console.log('Courses: ', this.courses);
          this.coursesBeginner = this.courses.filter(course => course.categories.indexOf('BEGINNER') != -1);
          this.coursesAdvanced = this.courses.filter(course => course.categories.indexOf('ADVANCED') != -1);
        });


    }

}
