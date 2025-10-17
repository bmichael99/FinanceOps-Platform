import dotenv from "dotenv"
dotenv.config();
import { S3Client, S3ClientConfig, PutObjectCommand, PutObjectCommandInput, GetObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";


//add typescript non-null asertion operators (!) to tell typescript
// that these values are not going to be null/undefined
const bucketName = process.env.BUCKET_NAME!;
const bucketRegion = process.env.BUCKET_REGION!;
const secretAccessKey = process.env.SECRET_ACCESS_KEY!;
const accessKey = process.env.ACCESS_KEY!;

const config: S3ClientConfig = {
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
  region: bucketRegion
}

const s3 = new S3Client(config);

export async function uploadFile (fileName : string, filePath : string, mimeType : string){
  //prepare file for upload
  const buffer = await fs.promises.readFile(filePath);

  const putObjectParams : PutObjectCommandInput = {
    Bucket: bucketName,
    Key: fileName,
    Body: buffer,
    ContentType: mimeType,
  }

  const command = new PutObjectCommand(putObjectParams);

  const s3Response = await s3.send(command);

  return s3Response;
}

export async function getSignedURL (fileName: string){
  const getObjectParams : PutObjectCommandInput = {
    Bucket: bucketName,
    Key: fileName,

  }

  const command = new GetObjectCommand(getObjectParams);

  const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

  return url;
}