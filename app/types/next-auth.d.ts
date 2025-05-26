import "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role: string;
      isApproved: boolean;
      needsApproval: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    email: string;
    role: string;
    isApproved: boolean;
    needsApproval: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    role: string;
    isApproved: boolean;
    needsApproval: boolean;
  }
}
