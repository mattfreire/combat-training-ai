import * as fs from 'fs';
import * as path from 'path';
import { Client } from 'minio';
import { env } from '~/env.mjs';

export const minioClient = new Client({
  endPoint: env.MINIO_ENDOINT,
  port: env.MINIO_PORT,
  useSSL: env.NODE_ENV === 'production',
  accessKey: env.MINIO_ACCESS_KEY,
  secretKey: env.MINIO_SECRET_KEY,
})


export const minioService = {
  async createBucket(bucketName: string, region = 'us-east-1') {
    return await minioClient.makeBucket(bucketName, region)
  },
  async uploadFile(bucketName: string, filePath: string, fileName: string) {
    const metaData = {
      'Content-Type': 'application/octet-stream',
    }
    return await minioClient.fPutObject(bucketName, fileName, filePath, metaData)
  },
  async uploadManyFiles(bucketName: string, filePaths: string[]) {
    const metaData = {
      'Content-Type': 'application/octet-stream',
    }
    await Promise.all(filePaths.map((filePath) => {
      const fileName = filePath.split('/').pop()
      if (!fileName) throw new Error('File name not found')
      return minioClient.fPutObject(bucketName, fileName, filePath, metaData)
    }))
  },
  async uploadFolder(sourceFolder: string, bucketName: string, prefix = '') {
    const files = fs.readdirSync(sourceFolder);
  
    for (const file of files) {
      const filePath = path.join(sourceFolder, file);
      const stats = fs.statSync(filePath);
  
      if (stats.isDirectory()) {
        await this.uploadFolder(filePath, bucketName, path.join(prefix, file));
      } else {
        const objectName = path.join(prefix, file);
  
        try {
          await this.uploadFile(bucketName, filePath, objectName)
          console.log(`Uploaded: ${objectName}`);
        } catch (error) {
          console.error(`Error uploading ${objectName}:`, error);
        }
      }
    }
  },
  printFiles(bucketName: string) {
    const stream = minioClient.listObjectsV2(bucketName, '', true);
    stream.on('data', function (obj) {
      console.log(obj)
    })
  }
}