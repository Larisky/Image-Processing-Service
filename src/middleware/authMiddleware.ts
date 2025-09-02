import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: { userId: string };
}

interface TokenPayload extends JwtPayload {
  userId: string;
}

export const authenticateJWT = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
if (!token) {
  return res.status(401).json({ error: "No token provided" });
}
try{
    
const decoded = jwt.verify(token, process.env.JWT_SECRET!) as unknown as TokenPayload;


    req.user = { userId: decoded.userId };
    next();
  } catch {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};
