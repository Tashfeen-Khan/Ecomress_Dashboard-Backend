import express from "express";
import { upload } from "../middleware/upload";
import { createOrUpdateCarousel, deleteSingleImage, getCarouselImages } from "../controllers/carouselController";

const router = express.Router();

// Add images to existing carousel or create if none exists
router.post("/", upload.array("images", 5), createOrUpdateCarousel);

// Get all carousel images
router.get("/", getCarouselImages);

// Delete a single image
router.delete('/:imageName', deleteSingleImage);

export default router;
