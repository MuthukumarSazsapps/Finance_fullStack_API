// import s3 from '../config/s3Config.js';
// import { v4 as uuidv4 } from 'uuid';

// const uploadFileToS3 = async (file) => {
//   const fileExtension = file.originalname.split('.').pop();
//   const fileName = `${uuidv4()}.${fileExtension}`;
//   const params = {
//     Bucket: process.env.AWS_BUCKET_NAME, // Your bucket name
//     Key: fileName, // File name in S3
//     Body: file.buffer, // File data
//     ACL: 'public-read', // Adjust permissions as needed
//     ContentType: file.mimetype, // Ensure proper content type
//   };

//   try {
//     const data = await s3.upload(params).promise();
//     return data.Location; // Return the file URL
//   } catch (error) {
//     console.error('Error uploading file to S3:', error);
//     throw new Error('File upload failed');
//   }
// };

// export default uploadFileToS3;

// import AWS from 'aws-sdk';
// import fs from 'fs';
// import path from 'path';

// const uploadFileToS3 = async (filePath) => {
//   const s3 = new AWS.S3();

//   const fileStream = fs.createReadStream(filePath);

//   const params = {
//     Bucket: process.env.AWS_BUCKET_NAME,
//     Key: `uploads/${Date.now()}-${path.basename(filePath)}`,
//     Body: fileStream,

//   };

//   const uploadResult = await s3.upload(params).promise();
//   return uploadResult.Location; // S3 URL of the uploaded file
// };
// export default uploadFileToS3;

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

import fs from 'fs';
import path from 'path';

const s3Client = new S3Client({
  region: process.env.AWS_REGION, // Ensure this matches the region of your S3 bucket
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Check for proper environment variable loading
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const uploadFileToS3 = async filePath => {
  console.log('filePath:', filePath);
  try {
    const fileStream = fs.createReadStream(filePath.path);

    const params = {
      Bucket: 'sazs-finance-app', // Replace with your bucket name
      Key: `uploads/${Date.now()}-${path.basename(filePath.originalname)}`, // Use basename to extract the file name
      Body: fileStream,
      ContentType: 'image/jpeg', // Set the correct MIME type
    };

    console.log('S3 Upload Params:', params);

    const command = new PutObjectCommand(params);
    const uploadResult = await s3Client.send(command);
    console.log('uploadResult', uploadResult);
    const fileUrl = `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
    console.log('File uploaded successfully:', fileUrl);
    return fileUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

export default uploadFileToS3;
