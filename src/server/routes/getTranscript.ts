import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'

export default defineEventHandler(async (ev) => {
  const client = new S3Client({
    region: 'us-east-2',
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET
    }
  })
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: 'transmissions/' + ev.req.body
  })

  const { Body } = await client.send(command)
  return await Body.transformToString()
})
