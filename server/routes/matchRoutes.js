// routes/matchRoutes.ts
import express from "express";
import {
  createMatch,
  updateMatchScore,
  getMatchDetails,
  getAllMatches,
} from "../controllers/matchController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, adminOnly, createMatch);
router.post("/create", createMatch);
router.get("/fetch", getMatchDetails);
router.put("/:id/score", protect, adminOnly, updateMatchScore);

export default router;
