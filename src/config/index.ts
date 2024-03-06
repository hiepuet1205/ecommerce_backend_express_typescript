import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const config: {
  port: number;
  accessToken: string;
  refreshToken: string;
  awsAccessKeyId: string;
  awsSecretAccessKey: string;
  bucketName: string;
  smtpHost: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword: string;
} = {
  port: Number(process.env.PORT) || 3000,
  accessToken: process.env.ACCESS_TOKEN || '',
  refreshToken: process.env.REFRESH_TOKEN || '',
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  bucketName: process.env.BUCKET_NAME || '',
  smtpHost: process.env.SMTP_HOST || '',
  smtpPort: Number(process.env.SMTP_PORT) || 0,
  smtpUsername: process.env.SMTP_USERNAME || '',
  smtpPassword: process.env.SMTP_PASSWORD || '',
}

export default config;