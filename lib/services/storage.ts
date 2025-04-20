import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export interface FileMetadata {
  duration?: number;
  voiceId?: string;
}

export class Storage {
  private s3Client: S3Client;
  private bucketName: string;
  private bucketUrl: string;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_DEFAULT_REGION || 'us-east-2',
      credentials: {
        accessKeyId: process.env.AWS_KEY_ID || '',
        secretAccessKey: process.env.AWS_ACCESS_KEY || '',
      },
    });
    
    this.bucketName = process.env.AWS_S3_BUCKET || '';
    this.bucketUrl = process.env.AWS_S3_BUCKET_URL || '';
  }

  /**
   * Uploads a base64 encoded file to S3 with metadata
   * @param fileContent - Base64 encoded file content
   * @param fileName - Name of the file in S3
   * @param metadata - File metadata (duration and voiceId)
   * @returns The S3 URL of the uploaded file
   */
  async uploadFile(fileContent: string, fileName: string, metadata: FileMetadata): Promise<string> {
    // Convert base64 to buffer
    const buffer = Buffer.from(fileContent, 'base64');
    
    const params = {
      Bucket: this.bucketName,
      Key: fileName,
      Body: buffer,
      Metadata: {
        duration: metadata.duration?.toString() || '',
        voiceId: metadata.voiceId || '',
      },
      ContentEncoding: 'base64',
    };

    try {
      await this.s3Client.send(new PutObjectCommand(params));
      return `${this.bucketUrl}/${fileName}`;
    } catch (error) {
      console.error('Error uploading file to S3:', error);
      throw new Error(`Failed to upload file to S3: ${(error as Error).message}`);
    }
  }
}
