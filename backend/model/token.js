// backend/model/token.js
// Simple in-memory token store for demo. Replace with DB for production.
const tokens = new Map();

function generateToken() {
  // Generate a random unicode string (base64 for simplicity)
  return Buffer.from(Math.random().toString(36).slice(2) + Date.now()).toString(
    "base64"
  );
}

function createToken() {
  const token = generateToken();
  tokens.set(token, { valid: true, created: Date.now() });
  return token;
}

function validateToken(token) {
  const entry = tokens.get(token);
  return entry && entry.valid;
}

function invalidateToken(token) {
  if (tokens.has(token)) {
    tokens.get(token).valid = false;
  }
}

export {
  createToken,
  validateToken,
  invalidateToken,
};
