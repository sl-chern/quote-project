import { Module } from '@nestjs/common';
import { BucketService } from './bucket.service';
import { AwsSdkModule } from 'aws-sdk-v3-nest';
import { S3Client } from '@aws-sdk/client-s3';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import s3Config from 'src/config/s3.config';

@Module({
  imports: [
    ConfigModule.forFeature(s3Config),
    AwsSdkModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const cfg = configService.get<ConfigType<typeof s3Config>>('s3');
        return new S3Client({
          region: cfg.region,
          credentials: {
            accessKeyId: cfg.accessKey,
            secretAccessKey: cfg.secretKey,
          },
        });
      },
      clientType: S3Client,
    }),
  ],
  exports: [BucketService],
  providers: [BucketService],
})
export class BucketModule {}
