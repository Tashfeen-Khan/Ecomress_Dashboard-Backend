// controllers/carouselController.ts
import { Request, Response } from "express";
import Carousel from "../models/bannerModel";
import fs from "fs";
import path from "path";

// Create or Add images to existing carousel (single instance)
export const createOrUpdateCarousel = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0)
      return res.status(400).json({ success: false, message: "No images uploaded" });

    if (files.length > 5)
      return res.status(400).json({ success: false, message: "Max 5 images allowed" });

    const images = files.map(file => file.path);

    // Check if carousel exists
    let carousel = await Carousel.findOne();
    if (carousel) {
      // Add new images to existing carousel
      carousel.images.push(...images);
      // Limit to max 5 images total
      if (carousel.images.length > 5) {
        return res.status(400).json({ 
          success: false, 
          message: "Total images cannot exceed 5" 
        });
      }
      carousel.updatedAt = new Date();
      await carousel.save();
    } else {
      // Create new carousel
      carousel = await Carousel.create({ images });
    }

    res.status(200).json({ success: true, carousel });
  } catch (error) {
    console.error("Carousel upload error:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// Get all carousel images
export const getCarouselImages = async (req: Request, res: Response) => {
  try {
    const carousel = await Carousel.findOne();
    if (!carousel) return res.status(404).json({ success: false, message: "No carousel found" });

    const images = carousel.images.map(img =>
      `${req.protocol}://${req.get("host")}/${img.replace(/\\/g, "/")}`
    );

    res.status(200).json({ success: true, count: images.length, images });
  } catch (error) {
    console.error("Fetch carousel error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete a single image from carousel
export const deleteSingleImage = async (req: Request, res: Response) => {
  try {
    const { imageName } = req.params;

    if (!imageName || !imageName.includes('.'))
      return res.status(400).json({ success: false, error: "Invalid image name" });

    const carousel = await Carousel.findOne();
    if (!carousel) return res.status(404).json({ success: false, error: "Carousel not found" });

    const imageToDelete = carousel.images.find(img => img.includes(imageName));
    if (!imageToDelete)
      return res.status(404).json({ success: false, error: "Image not found", availableImages: carousel.images });

    // Remove image from array & save
    carousel.images = carousel.images.filter(img => img !== imageToDelete);
    carousel.updatedAt = new Date();
    await carousel.save();

    // Delete file from server
    const filePath = path.join(__dirname, "..", "..", "uploads", path.basename(imageToDelete));
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    res.status(200).json({ success: true, message: "Image deleted successfully", deletedImage: imageToDelete, remainingImages: carousel.images });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};
