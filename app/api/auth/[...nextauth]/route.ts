import NextAuth from "next-auth";
import User from "@/models/users";
import connectToDatabase from "@/lib/mongo/mongodb";
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        try {
          await connectToDatabase();
          const user = await User.findOne({ email: credentials?.email });

          if (!user) {
            throw new Error("User not found");
          }

          const isValidPassword = await bcrypt.compare(
            credentials?.password ?? "",
            user.password as string
          );

          if (!isValidPassword) {
            throw new Error("Invalid password");
          }

          // For RMV Admin users who are not approved
          if (user.role === "rmvAdmin" && !user.isApproved) {
            return {
              id: user._id.toString(),
              email: user.email,
              role: user.role,
              isApproved: false,
              needsApproval: true,
            };
          }

          // Convert MongoDB document to plain object
          return {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
            isApproved: user.isApproved,
            needsApproval: false,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.isApproved = user.isApproved;
        token.needsApproval = user.needsApproval;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          email: token.email as string,
          role: token.role as string,
          isApproved: token.isApproved as boolean,
          needsApproval: token.needsApproval as boolean,
        };
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  // Add these production-specific settings
  debug: process.env.NODE_ENV === "development",
  logger: {
    error(code, metadata) {
      console.error(code, metadata);
    },
    warn(code) {
      console.warn(code);
    },
    debug(code, metadata) {
      if (process.env.NODE_ENV === "development") {
        console.log(code, metadata);
      }
    },
  },
});

export { handler as GET, handler as POST };
