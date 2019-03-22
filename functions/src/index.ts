import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((req, res) => {
//  res.status(200).json({message: "Hello from Firebase!"});
// });

const express = require('express');

const app = express();

app.get('/courses', (req, res) => {

});
