import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'

export default defineEventHandler(async () => {
  const client = new S3Client({
    region: 'us-east-2',
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET
    }
  })
  const command = new ListObjectsCommand({
    Bucket: process.env.S3_BUCKET,
  })

  return client.send(command)
})
