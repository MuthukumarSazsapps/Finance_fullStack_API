//-------------------------------------------------------

// import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// import fs from 'fs';
// import path from 'path';

// const s3Client = new S3Client(
//   {
//   region: "ap-south-1", // Ensure this matches the region of your S3 bucket
//   credentials: {
//     accessKeyId: "AKIAXYKJTMARNSLdhdfhgddgdg", // Check for proper environment variable loading
//     secretAccessKey: "5SqezAmkz5e5dcSrtgdrgdfghdfG2x8B19yGEy4Jhdfhdfhdfhd",

//   },
// });
// console.log('process.env.AWS_ACCESS_KEY_ID:', process.env.REACT_AWS_ACCESS_KEY_ID);

// const uploadFileToS3 = async filePath => {
//   console.log('filePath:', filePath);
//   try {
//     const fileStream = fs.createReadStream(filePath.path);

//     const params = {
//       Bucket: 'sazs-finance-app', // Replace with your bucket name
//       Key: `uploads/${Date.now()}-${path.basename(filePath.originalname)}`, // Use basename to extract the file name
//       Body: fileStream,
//       ContentType: 'image/jpeg', // Set the correct MIME type
//     };

//     console.log('S3 Upload Params:', params);

//     const command = new PutObjectCommand(params);
//     const uploadResult = await s3Client.send(command);
//     console.log('uploadResult', uploadResult);
//     const fileUrl = `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
//     console.log('File uploaded successfully:', fileUrl);
//     return fileUrl;
//   } catch (error) {
//     console.error('Error uploading file:', error);
//     throw error;
//   }
// };

// export default uploadFileToS3;

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

// Configure S3 Client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const uploadFileToS3 = async file => {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `uploads/${Date.now()}-${file.originalname}`, // Unique key for each file
      Body: file.buffer, // Directly use buffer
      ContentType: file.mimetype, // Set the correct MIME type
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    const fileUrl = `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
    console.log('File uploaded successfully:', fileUrl);
    return fileUrl;
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw error;
  }
};

export default uploadFileToS3;
