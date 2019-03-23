import * as functions from 'firebase-functions';
const path = require('path');
const os = require('os');
const { Storage } = require('@google-cloud/storage');
const mkdirp = require('mkdirp-promise');

const gcs = new Storage();

export const resizeThumbnail = functions.storage.object()
  .onFinalize(async (object, context) => {

    const fileFullPath = object.name || '',
      contentType = object.contentType || '',
      fileDirectory = path.dirname(fileFullPath),
      fileName = path.basename(fileFullPath),
      tempLocalDir = path.join(os.tmpdir(), fileDirectory);

      console.log('Thumbnail generation started: ', fileFullPath, contentType, fileDirectory, fileName);

      if (!contentType.startsWith('image/')) {
        console.log('Exiting image processing...');
        return null;
      }

      await mkdirp(tempLocalDir);

      const bucket = gcs.bucket(object.bucket);

      const originalImageFile = bucket.file(fileFullPath);

      const tempLocalFile = path.join(os.tmpdir(), fileFullPath);

      console.log('Downloading image to: ', tempLocalFile);

      await originalImageFile.download({destination: tempLocalFile});

      return null;
  });
