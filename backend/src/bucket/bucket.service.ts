import { DeleteObjectCommand, GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { InjectAws } from 'aws-sdk-v3-nest';
import s3Config from 'src/config/s3.config';

@Injectable()
export class BucketService {
  constructor(
    @InjectAws(S3Client) private readonly s3: S3Client,
    @Inject(s3Config.KEY) private readonly bucketConfig: ConfigType<typeof s3Config>,
  ) {}

  async generateSignedURL(imageName: string): Promise<string | ''> {
    const params = {
      Bucket: this.bucketConfig.bucketName,
      Key: imageName,
    };
    try {
      const imgURL = await getSignedUrl(this.s3, new GetObjectCommand(params));
      return imgURL;
    } catch (error) {
      console.log(error);
      return '';
    }
  }

  async uploadFile(imageName: string, image: string): Promise<string | ''> {
    const params = {
      Bucket: this.bucketConfig.bucketName,
      Key: imageName,
      Body: Buffer.from(image, 'base64'),
      ContentType: 'image/png',
    };
    try {
      const upload = new Upload({
        client: this.s3,
        params,
      });
      await upload.done();
      return this.generateSignedURL(imageName);
    } catch (error) {
      console.log(error);
      return '';
    }
  }

  async deleteFile(imageName: string): Promise<void> {
    const params = {
      Bucket: this.bucketConfig.bucketName,
      Key: imageName,
    };
    try {
      await this.s3.send(new DeleteObjectCommand(params));
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
