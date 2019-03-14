import {Component, OnInit} from '@angular/core';
import {Course} from "../model/course";
import {Observable} from "rxjs";
import {finalize, map} from "rxjs/operators";
import {CoursesService} from "../services/courses.service";


@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    courses$: Observable<Course[]>;

    coursesBeginner$: Observable<Course[]>;
    coursesAdvanced$: Observable<Course[]>;

    constructor(private coursesService: CoursesService) {}

    ngOnInit() {
      this.loadCourses();
    }

    public courseFilter(courses$: Observable<Course[]>, categoryName: string): Observable<Course[]> {
      return courses$.pipe(
        map(courses => courses.filter(
          course => course.categories.includes(categoryName))
        )
      );
    }

    loadCourses() {
      this.courses$ = this.coursesService.getCourses();

      this.coursesBeginner$ = this.courseFilter(this.courses$,'BEGINNER');
      this.coursesAdvanced$ = this.courseFilter(this.courses$,'ADVANCED');
    }

}
