import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

import { Course } from './../model/course';

const config = {
  apiKey: "AIzaSyD4279I3tW_lTgeK4U4oeJZSu176YJTFEA",
  authDomain: "fb-course-ncp.firebaseapp.com",
  databaseURL: "https://fb-course-ncp.firebaseio.com",
  projectId: "fb-course-ncp",
  storageBucket: "fb-course-ncp.appspot.com",
  messagingSenderId: "746287073234"
};

firebase.initializeApp(config);

const db = firebase.firestore();
const settings = {timestampsInSnapshots: true};

db.settings(settings);

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    db.collection('courses')
      .get()
      .then(snaps => {
          let courses: Course[] = snaps.docs.map(snap => {
            return <Course>{
              id: snap.id,
              ...snap.data(),
            };
          });
          console.log('Courses: ', courses);
        }
      );

    // db.doc('courses/0M6CZTfj8RQ8lZH8Sb2Q')
    //   .get()
    //   .then(db => console.log(db.data()));
  }

}
