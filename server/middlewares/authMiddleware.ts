import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export const authenticate = async (
  req: Request,
  res: Response,
  next: Function
) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
    });
  }

  if (!token.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Invalid token format. Use: Bearer <token>",
    });
  }

  try {
    const actualToken = token.substring(7);

    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET!) as {
      id: number;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }
    (req as any).user = user;
    return next();
  } catch (error) {
    console.error("authenticate error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
