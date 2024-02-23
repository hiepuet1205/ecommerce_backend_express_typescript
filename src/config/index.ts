import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const config: {
  port: number;
  accessToken: string;
  refreshToken: string;
  awsAccessKeyId: string;
  awsSecretAccessKey: string;
  bucketName: string;
} = {
  port: Number(process.env.PORT) || 3000,
  accessToken: process.env.ACCESS_TOKEN || '',
  refreshToken: process.env.REFRESH_TOKEN || '',
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  bucketName: process.env.BUCKET_NAME || '',
}

export default config;