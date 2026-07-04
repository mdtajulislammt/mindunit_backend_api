/// <reference types="multer" />
import { Injectable, Logger } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private useCloudinary = false;

  constructor() {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (cloudName && apiKey && apiSecret) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
      });
      this.useCloudinary = true;
      this.logger.log('Cloudinary successfully configured.');
    } else {
      this.logger.warn('Cloudinary credentials missing in .env. Falling back to local storage uploader.');
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    if (this.useCloudinary) {
      return new Promise((resolve) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'mindunite_posts',
          },
          (error, result) => {
            if (error || !result) {
              this.logger.error('Cloudinary upload failed, falling back to local storage uploader:', error);
              resolve(this.uploadLocal(file));
            } else {
              resolve(result.secure_url);
            }
          }
        );
        uploadStream.end(file.buffer);
      });
    } else {
      return this.uploadLocal(file);
    }
  }

  private async uploadLocal(file: Express.Multer.File): Promise<string> {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const ext = path.extname(file.originalname) || '.png';
    const uniqueFilename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    const filePath = path.join(uploadDir, uniqueFilename);

    await fs.promises.writeFile(filePath, file.buffer);
    this.logger.log(`File saved locally: ${filePath}`);

    return `https://unit-backend.pixelstack.cloud/api/public/uploads/${uniqueFilename}`;
  }
}