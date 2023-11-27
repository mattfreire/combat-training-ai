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

const bucketName = 'repos'
const excludedFiles = ['.git', '.DS_Store']

export const minioService = {
  async createBucket(region = 'us-east-1') {
    return await minioClient.makeBucket(bucketName, region)
  },
  async getOrCreateBucket(region = 'us-east-1') {
    try {
      await minioClient.makeBucket(bucketName, region)
    } catch (e) {
      // Bucket already exists
    }
  },
  async uploadFile(filePath: string, fileName: string) {
    const metaData = {
      'Content-Type': 'application/octet-stream',
    }
    return await minioClient.fPutObject(bucketName, fileName, filePath, metaData)
  },
  async uploadManyFiles(filePaths: string[]) {
    const metaData = {
      'Content-Type': 'application/octet-stream',
    }
    await Promise.all(filePaths.map((filePath) => {
      const fileName = filePath.split('/').pop()
      if (!fileName) throw new Error('File name not found')
      return minioClient.fPutObject(bucketName, fileName, filePath, metaData)
    }))
  },
  async uploadFolder(sourcePath: string, prefix: string) {
    const files = fs.readdirSync(sourcePath);

    const uploadPromises = files.map(async (file) => {
      if (excludedFiles.includes(file)) {
        return
      }

      const filePath = path.join(sourcePath, file);
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        await this.uploadFolder(filePath, path.join(prefix, file));
      } else {
        const objectName = path.join(prefix, path.relative(sourcePath, filePath));
        return this.uploadFile(filePath, objectName)
          .then(() => console.log(`Uploaded: ${objectName}`));
      }
    });
    try {
      await Promise.all(uploadPromises);
    } catch (error) {
      console.error(`Error uploading files:`, error);
    }
  },
  getAllFilePaths(sourcePath: string, prefix: string): string[] {
    const files = fs.readdirSync(sourcePath);
  
    const allFilePaths = files.map((file) => {
      const filePath = path.join(sourcePath, file);
      const stats = fs.statSync(filePath);
  
      if (stats.isDirectory()) {
        return this.getAllFilePaths(filePath, path.join(prefix, file));
      } else {
        return filePath
      }
    })

    return allFilePaths.flat()
  },
  readFileLocal(filePath: string) {
    const localRoot = env.FILE_STORAGE_PATH
    return fs.readFileSync(localRoot + filePath)
  },
  async readFile(fileName: string) {
    // This returns a stream
    return await minioClient.getObject(bucketName, fileName)
  },
  printFiles() {
    const stream = minioClient.listObjectsV2(bucketName, '', true);
    stream.on('data', function (obj) {
      console.log(obj)
    })
  }
}