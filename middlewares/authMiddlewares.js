import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/usersModel";

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      // if (!token) {
      //   res.status(401);
      //   throw new Error("invalid token");
      // }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res.status(401);
      throw new Error("not authorize");
    }
  }
});

export default protect;
