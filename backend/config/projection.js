import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // fetch user to get role (some routes rely on req.user.role)
    const user = await userModel.findById(verified.id).select("role");
    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }

    req.user = { id: verified.id, role: user.role };
    next();
  } catch (err) {
    console.error("auth error:", err.message);
    res.status(401).json({ msg: "Token is not valid" });
  }
};

export default auth;