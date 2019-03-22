import * as functions from 'firebase-functions';
import {db} from "./init";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((req, res) => {
//  res.status(200).json({message: "Hello from Firebase!"});
// });

import * as express from "express";
const cors = require('cors');

const app = express();
app.use(cors({origin: true}));

app.get('/courses', async (req, res) => {
  const snaps = await db.collection('courses').get();
  const courses = [];

  snaps.forEach(snap => courses.push(snap.data()));

  res.status(200).json({courses});

});

export const getCourses = functions.https.onRequest(app);
