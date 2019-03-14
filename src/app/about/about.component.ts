import { Component, OnInit } from '@angular/core';
import {AngularFirestore} from "@angular/fire/firestore";
import {of} from "rxjs";
import {Course} from "../model/course";

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  course;
  constructor(private db: AngularFirestore) { }

  ngOnInit() {

    // const courseRef = this.db.doc('/courses/0M6CZTfj8RQ8lZH8Sb2Q')
      // .snapshotChanges()
      // .subscribe(snaps => {
      //   const course: any = snaps.payload.data();
      //   console.log('courseRef: ', course);
      //   console.log('courseRef.relatedCourseRef: ', course.relatedCourseRef);
      //   this.db.doc(course.relatedCourseRef).snapshotChanges().subscribe(subdoc => console.log('Subdoc: ', subdoc.payload.data()));
      // });

    const courseRef = this.db.doc('/courses/0M6CZTfj8RQ8lZH8Sb2Q')
      .snapshotChanges()
      .subscribe(snap => {
        this.course = snap.payload.data();
        console.log('Course Data: ', this.course);

        const relatedCourse = this.db.doc(this.course.relatedCourseRef)
          .snapshotChanges()
          .subscribe( snap => {
            console.log('Related Course Data: ', snap.payload.data());
          });
      });
  }

  save() {
    const fbCourseRef = this.db.doc('/courses/0M6CZTfj8RQ8lZH8Sb2Q').ref;
    const rxCourseRef = this.db.doc('/courses/wO3TH5ERQFYLIgGHHiUm').ref;

    const batch = this.db.firestore.batch();

    batch.update(fbCourseRef,{ titles: { description: 'Firebase Course'}});
    batch.update(rxCourseRef,{ titles: { description: 'RxJs Course'}});

    const batch$ = of(batch.commit());
    batch$.subscribe();
  }

  async runTransaction() {

    const newCounter = await this.db.firestore.runTransaction(async transaction => {
      console.log('Running transaction...');

      const courseRef = this.db.doc('/courses/0M6CZTfj8RQ8lZH8Sb2Q').ref;
      const snap = await transaction.get(courseRef);
      const course = <Course> snap.data();
      const lessonCount = course.lessonsCount + 1;
      transaction.update(courseRef, {lessonCount: lessonCount});
      return lessonCount;
    });

    console.log('New Counter: ', newCounter);
  }

}
