import {PutObjectCommand, GetObjectCommand} from "@aws-sdk/client-s3";
import s3 from "../config/s3"
import prisma from "../prisma";
import {v4 as uuidv4 } from "uuid";
import sharp from "sharp"
import { Readable } from "stream";

export interface TransformOptions {
  resize?: { width?: number; height?: number };
  rotate?: number; // degrees
  format?: "jpeg" | "png" | "webp";
  grayscale?: boolean;
  flip?: boolean; //vertical
  flop?: boolean; //horizontal
  crop?: {width: number; height: number};
  filters?: { grayscale?: boolean;  sepia?: boolean };
  watermark?: { text?: string; gravity?: "north" | "south" | "east" | "west" | "center" };
  compress?: {quality: number};


}


export class ImageServices {
    static async uploadImage(file: Express.Multer.File,  userId: string) {
        const bucketName = process.env.AWS_BUCKET_NAME!;
        const key = `${userId}/${uuidv4()}-${file.originalname}`;

 await s3.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      })
    );

    const image = await prisma.image.create({
  data: {
    url: `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
    filename: file.originalname,
    metadata: { size: file.size, mimetype: file.mimetype, transformation: {} },
    ownerId: userId,
    s3Key: key
  },
});
return image;
  }

  static async listImages(userId: string) {
    return prisma.image.findMany({ where: { ownerId: userId } });

    }
       
     //transform an existing image

    static async transformImage(imageId: string, userId: string, options: TransformOptions)
    {
      const bucketName = process.env.AWS_BUCKET_NAME!;

      //find original image

      const original = await prisma.image.findFirst({
        where: {id: imageId, ownerId: userId},
      });

      if(!original) throw new Error("Image not found or access denied");

      //Download from S3 
       const buffer = await this.downloadFromS3(original.s3Key);

    // Apply Sharp transformations
    const transformedBuffer = await this.applyTransforms(buffer, options);

    //Generate a new S3 key for the variant
    const variantKey = this.makeVariantKey(original.s3Key, uuidv4());

   // Upload transformed image to S3
    await s3.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: variantKey,
        Body: transformedBuffer,
        ContentType: "image/jpeg",
      })
    );
      
    // save variant metadata into DB
      const variant = await prisma.image.create({
      data: {
        url: `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${variantKey}`,
        filename: `variant-${original.filename}`,
        metadata: { ...options, size: transformedBuffer.length },
        ownerId: userId,
        s3Key: variantKey,
        parentId: original.id, // link variant to original
      },
    });

    return variant;
  }

  // generate a unique s3 key for image variant
  private static makeVariantKey(originalKey: string, suffix: string): string {
    const ext = originalKey.split(".").pop();
    return `${originalKey.replace(/\.[^/.]+$/, "")}-${suffix}.${ext}`;
  }

  // Download image from S3 into a buffer

  private static async downloadFromS3(key: string): Promise<Buffer> {
    const bucketName = process.env.AWS_BUCKET_NAME!;
    const response = await s3.send(
      new GetObjectCommand({
        Bucket: bucketName,
        Key: key,
      })
    );

    const stream = response.Body as Readable;
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(chunk as Buffer);
    }
    return Buffer.concat(chunks);
  }

  // apply Sharp transformations

   private static async applyTransforms(buffer: Buffer, options: TransformOptions): Promise<Buffer> {
    let image = sharp(buffer);

    if (options.resize) {
      image = image.resize(options.resize.width, options.resize.height);
    }
    if (options.rotate) {
      image = image.rotate(options.rotate);
    }
    if (options.flip) {
      image = image.flip();
    }
    if (options.flop) {
      image = image.flop();
    }
    if (options.crop) {
      image = image.extract({
        width: options.crop.width,
        height: options.crop.height,
        left: 0,
        top: 0,
      });
    }
    if (options.grayscale || options.filters?.grayscale) {
      image = image.grayscale();
    }
    if (options.filters?.sepia) {
      image = image.modulate({ saturation: 0.3, hue: 30 });
    }
    if (options.watermark?.text) {
      const svg = `
        <svg width="500" height="500">
          <text x="50%" y="50%" font-size="40" text-anchor="middle" fill="white" opacity="0.5">
            ${options.watermark.text}
          </text>
        </svg>`;
      image = image.composite([
        { input: Buffer.from(svg), gravity: options.watermark.gravity || "southeast" },
      ]);
    }
    if (options.compress) {
      image = image.jpeg({ quality: options.compress.quality });
    }
    if (options.format) {
      image = image.toFormat(options.format);
    }

    return await image.toBuffer();
  }

  static async getImageById(imageId: string, userId: string) {
  return prisma.image.findFirst({
    where: {
      id: imageId,
      ownerId: userId, // ensures user can only access their own images
    },
  });
}

}