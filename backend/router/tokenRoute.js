import express from "express";
import { createToken, validateToken, invalidateToken } from "../model/token.js";

const router = express.Router();

// GET /api/token - generate a new single-use token
router.get("/token", (req, res) => {
  const token = createToken();
  res.json({ token });
});

// POST /api/token/validate - validate a token
router.post("/token/validate", (req, res) => {
  const { token } = req.body;
  if (validateToken(token)) {
    res.json({ valid: true });
  } else {
    res.status(400).json({ valid: false, error: "Invalid or used token" });
  }
});

// POST /api/token/invalidate - invalidate a token
router.post("/token/invalidate", (req, res) => {
  const { token } = req.body;
  invalidateToken(token);
  res.json({ success: true });
});

export default router;
