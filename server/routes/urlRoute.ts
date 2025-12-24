import { authenticate } from "../middlewares/authMiddleware.js";
import { url, shorturl, redirectToOriginalUrl } from "../controllers/urlController.js";
import express from "express";

const router = express.Router();

router.post("/url",authenticate,url);
router.post("/shortenurl",authenticate,shorturl);
router.get("/:shortcode",redirectToOriginalUrl)

export default router;