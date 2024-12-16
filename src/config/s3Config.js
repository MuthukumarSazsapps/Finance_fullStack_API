import AWS from 'aws-sdk';

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Store in .env
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Store in .env
  region: process.env.AWS_REGION, // Store in .env
});

const s3 = new AWS.S3();
export default s3;
