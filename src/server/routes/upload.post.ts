import {
  S3Client,
  PutObjectCommand,
  ListObjectsCommand,
} from "@aws-sdk/client-s3";
import fs from "fs";
import { Upload } from "@aws-sdk/lib-storage";
import { defineEventHandler, readBody } from "h3";

export default defineEventHandler(async (e) => {
  const body = await readBody(e);
  console.debug("body", body);
  const client = new S3Client({
    region: "us-east-2",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET,
    },
  });
  const params = {
    Bucket: "luna-channeling",
    Key: body.dateSelected,
    Body: fs.createReadStream(body.selectedFile),
    ContentType: body.selectedFile.type,
  };

  try {
    await client.send(new PutObjectCommand(params));
    return {
      message: "Upload successful",
      receivedData: body,
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    return {
      message: "Error uploading file",
      receivedData: body,
      error,
    };
  }
  // const command = new ListObjectsCommand({
  // })

  // return client.send(command)
});
