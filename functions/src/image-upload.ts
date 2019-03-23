import * as functions from 'firebase-functions';
const path = require('path');
const os = require('os');
const { Storage } = require('@google-cloud/storage');
const mkdirp = require('mkdirp-promise');
const spawn = require('child-process-promise').spawn;

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

      await bucket.upload(outputFile, { destination: outputFilePath, metadata});

      return null;
  });
