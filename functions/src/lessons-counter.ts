import * as functions from 'firebase-functions';
import {db} from "./init";

export const onLessonAdded =
  functions.firestore.document(`/courses/{courseId}/lessons/{lessonId}`)
    .onCreate(async (snap, context) => {
      console.log('Snap & Context: ', snap, context);

      // const courseId = context.params.courseId;

      console.log('Running onLessonAdded trigger...');

      return db.runTransaction(async transaction => {
        const courseRef = snap.ref.parent.parent;

        const courseSnap = await transaction.get(courseRef);

        const course = courseSnap.data();

        const changes = { lessonsCount: course.lessonCount + 1};

        transaction.update(courseRef, changes);

      });

    });
