import { Request } from 'express'
import multer from 'multer'
import multerS3 from 'multer-s3'
import config from '.'
import aws from 'aws-sdk'
import { S3Client } from "@aws-sdk/client-s3"

const s3 = new S3Client({
  credentials: {
      accessKeyId: config.awsAccessKeyId,
      secretAccessKey: config.awsSecretAccessKey
  },
  region: "ap-southeast-2"
})

export const s3Storage = multerS3({
  s3: s3,
  bucket: config.bucketName,
  metadata: (req, file, cb) => {
      cb(null, {fieldname: file.fieldname})
  },
  key: (req, file, cb) => {
      const fileName = Date.now() + "_" + file.fieldname + "_" + file.originalname;
      cb(null, fileName);
  }
});
