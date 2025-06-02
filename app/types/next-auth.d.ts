import "next-auth";

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
