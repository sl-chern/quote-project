import { registerAs } from '@nestjs/config';
import { S3Config } from 'src/types/S3Config';

export default registerAs(
  's3',
  (): S3Config => ({
    accessKey: process.env.AWS_ACCESS_KEY,
    secretKey: process.env.AWS_SECRET_KEY,
    region: process.env.S3_BUCKET_REGION,
    bucketName: process.env.S3_BUCKET_NAME,
  }),
);
