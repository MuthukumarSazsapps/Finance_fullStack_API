// import multer from 'multer';

// const upload = multer({ dest: 'uploads/' });
// export default upload;

import multer from 'multer';
import AWS from 'aws-sdk';
import multerS3 from 'multer-s3';

// Configure AWS SDK
const s3 = new AWS.S3({
  accessKeyId: 'AKIAXYKJTMARNSLDHDF5',
  secretAccessKey: '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',
  region: 'ap-south-1',
});

// Multer S3 Storage
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'sazs-finance-app',
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
});

export default upload;
