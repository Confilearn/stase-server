import express from "express";
import { healthCheck } from "../controllers/healthController.js";

const router = express.Router();

/**
 * Health check routes
 * Provides monitoring and status endpoints
 */

router.get("/", healthCheck);

export default router;
