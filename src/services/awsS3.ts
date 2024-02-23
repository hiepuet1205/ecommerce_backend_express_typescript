import { S3 } from "aws-sdk";
import { CreateBucketRequest } from "aws-sdk/clients/s3";
import config from "../config";
import fs from 'fs';

export const checkBucket = async (s3: S3, bucket: string) => {
  try {
    const res = await s3.headBucket({ Bucket: bucket }).promise()
    console.log("Bucket already Exist", res.$response.data);
    return { success: true, message: "Bucket already Exist", data: {} };
  } catch (error) {
    console.log("Error bucket don't exsit", error);
    return { success: false, message: "Error bucket don't exsit", data: error };
  }
};

export const createBucket = async (s3: S3) => {

  const params: CreateBucketRequest = {
    Bucket: config.bucketName,
    CreateBucketConfiguration: {
      LocationConstraint: "ap-south-1"
    }
  }

  try {
    const res = await s3.createBucket(params).promise();
    console.log("Bucket Created Successfull", res.Location);
    return { success: true, message: "Bucket Created Successfull", data: res.Location };

  } catch (error) {
    console.log("Error: Unable to create bucket \n", error);
    return { success: false, message: "Unable to create bucket", data: error };;
  }
}

export const initBucket = async (s3: S3) => {
  const bucketStatus = await checkBucket(s3, config.bucketName);

  if( !bucketStatus.success ) { 
    let bucket = await createBucket(s3);
    console.log(bucket.message);
  }
}

export const uploadToS3 = async (s3: S3, fileData?: Express.Multer.File) => {
  try {
    const fileContent = fs.readFileSync(fileData!.path);

        const params = {
          Bucket: config.bucketName,
          Key: fileData!.originalname,
          Body: fileContent
        };

        try {
          const res = await s3.upload(params).promise();

          console.log("File Uploaded with Successfull", res.Location);

          return {success: true, message: "File Uploaded with Successfull", data: res.Location};
        } catch (error) {
          return {success: false, message: "Unable to Upload the file", data: error};
        }

    } catch (error) {
    return {success:false, message: "Unalbe to access this file", data: {}};
  }
}