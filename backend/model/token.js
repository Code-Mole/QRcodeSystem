// backend/model/token.js
// Persist tokens in MongoDB so they remain valid until used.
import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true, index: true },
  valid: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

const TokenModel =
  mongoose.models.Token || mongoose.model("Token", tokenSchema);

function generateToken() {
  // Generate a random unicode string (base64 for simplicity)
  return Buffer.from(Math.random().toString(36).slice(2) + Date.now()).toString(
    "base64"
  );
}

async function createToken() {
  const token = generateToken();
  try {
    await TokenModel.create({ token });
    return token;
  } catch (err) {
    // In the rare case of collision, try again
    return createToken();
  }
}

async function validateToken(token) {
  if (!token) return false;
  const entry = await TokenModel.findOne({ token }).lean();
  return !!entry && entry.valid === true;
}

async function invalidateToken(token) {
  if (!token) return;
  await TokenModel.updateOne({ token }, { $set: { valid: false } });
}

export { createToken, validateToken, invalidateToken };
