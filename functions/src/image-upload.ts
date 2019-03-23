import * as functions from 'firebase-functions';
import {db} from "./init";
const path = require('path');
const os = require('os');
const { Storage } = require('@google-cloud/storage');
const mkdirp = require('mkdirp-promise');
const spawn = require('child-process-promise').spawn;
const rimraf = require('rimraf');

const gcs = new Storage();

export const resizeThumbnail = functions.storage.object()
  .onFinalize(async (object, context) => {

    const fileFullPath = object.name || '',
      contentType = object.contentType || '',
      fileDirectory = path.dirname(fileFullPath),
      fileName = path.basename(fileFullPath),
      tempLocalDir = path.join(os.tmpdir(), fileDirectory);

      console.log('Thumbnail generation started: ', fileFullPath, contentType, fileDirectory, fileName);

      if (!contentType.startsWith('image/') || fileName.startsWith('thumb_')) {
        console.log('Exiting image processing...');
        return null;
      }

      await mkdirp(tempLocalDir);

      const bucket = gcs.bucket(object.bucket);

      const originalImageFile = bucket.file(fileFullPath);

      const tempLocalFile = path.join(os.tmpdir(), fileFullPath);

      console.log('Downloading image to: ', tempLocalFile);

      await originalImageFile.download({destination: tempLocalFile});

      // generate thumbnail using ImageMagick, ImageMagick is bundled in the environment on Google

      const outputFilePath = path.join(fileDirectory, 'thumb_' + fileName);

      const outputFile = path.join(os.tmpdir(), outputFilePath);

      console.log('Generating thumbnail to: ', outputFile);

      spawn('convert', [tempLocalFile, '-thumbnail', '510x287 >', outputFile],
        { capture: ['stdout', 'stderr']});

      // Upload thumbnail back to Firebase Storage

      const metadata = {
        contentType: object.contentType,
        cacheControl: 'public, max-age=2592000, s-maxage=2592000'
      };

      console.log('Uploading the thumbnail to storage: ', outputFile, outputFilePath);

      const uploadedFiles = await bucket.upload(outputFile, { destination: outputFilePath, metadata});

      // delete local files to avoid filling up the file system over time
      rimraf.sync(tempLocalDir);

      await originalImageFile.delete();

      // create link to uploaded file
      const thumbnail = uploadedFiles[0];
      const url = await thumbnail.getSignedUrl({action: 'read', expires: new Date(3000,0,1)});

      console.log('Generated thumbnail url: ', url);

      // save thumbnail link in database

      const frags = fileFullPath.split('/');
      const courseId = frags[1];

      console.log('Saving url to database', courseId);

      return db.doc(`courses/${courseId}`).update({uploadedImageUrl: url}); // could await it too
  });
