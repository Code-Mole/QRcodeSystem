import express from "express";
import { createToken, validateToken, invalidateToken } from "../model/token.js";

const router = express.Router();

// GET /api/token - generate a new single-use token
router.get("/token", async (req, res) => {
  try {
    const token = await createToken();
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Could not create token" });
  }
});

// POST /api/token/validate - validate a token
router.post("/token/validate", async (req, res) => {
  const { token } = req.body;
  try {
    const valid = await validateToken(token);
    if (valid) {
      res.json({ valid: true });
    } else {
      res.status(400).json({ valid: false, error: "Invalid or used token" });
    }
  } catch (err) {
    res.status(500).json({ valid: false, error: "Validation error" });
  }
});

// POST /api/token/invalidate - invalidate a token
router.post("/token/invalidate", async (req, res) => {
  const { token } = req.body;
  try {
    await invalidateToken(token);
    res.json({ success: true });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: "Could not invalidate token" });
  }
});

export default router;
