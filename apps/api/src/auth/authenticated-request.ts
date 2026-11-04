import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    role: "CUSTOMER" | "AGENT" | "ADMIN";
  };
}