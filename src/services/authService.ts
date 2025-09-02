import prisma from "../prisma";
import argon from "argon2";
import jwt from "jsonwebtoken";

export class AuthService {
  static async register(email: string, password: string, username?: string) {
    // Check if email already exists (email is still unique)
    const existing = await prisma.user.findUnique({
      where: { email },
    });
    if (existing) throw new Error("Email already exists");

    // Check if username exists (only if provided)
    if (username?.trim()) {
      const existingUserName = await prisma.user.findFirst({
        where: { username: username.trim() },
      });
      if (existingUserName) throw new Error("Username already taken");
    }
        const hashedPassword = await argon.hash(password);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                ...(username ? { username } : {})
            }
        });

        const token = jwt.sign({userId: user.id  }, process.env.JWT_SECRET!, {
            expiresIn: "1h",
            
        });

        return {id: user.id, email: user.email, token};
    }

    static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Invalid credentials");

    const valid = await argon.verify(user.password, password);
    if (!valid) throw new Error("Invalid credentials");

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    return { id: user.id, email: user.email, token };
  }
}

