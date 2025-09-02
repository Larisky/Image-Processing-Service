import { Response } from "express";
import { ImageServices, TransformOptions } from "../services/imageService";
import { AuthRequest } from "../middleware/authMiddleware";


export class ImageController {

static async uploadImage (req: AuthRequest, res: Response){
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });
        const image = await ImageServices.uploadImage(req.file, req.user!.userId);
        res.json(image);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}

static async listImages(req: AuthRequest, res: Response) {
    try {
        const images = await ImageServices.listImages(req.user!.userId);
        res.json(images);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}

static async transformImage(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const transformations: TransformOptions = req.body;
    if (!id) return res.status(400).json({ error: "Image ID is required" });

      const transformedImage = await ImageServices.transformImage(
        id,
        req.user!.userId,
        transformations
      );
      res.json(transformedImage);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getImage(req: AuthRequest, res: Response) {
    try {
      const  id = req.params.id as string;
      const image = await ImageServices.getImageById(id, req.user!.userId);
      if (!image) return res.status(404).json({ error: "Image not found" });
      res.json(image);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}
