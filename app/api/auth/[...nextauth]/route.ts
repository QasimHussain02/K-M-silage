import { connectToDatabase } from "@/lib/mongo";
import NextAuth from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions, Session } from "next-auth";
import type { User as NextAuthUser } from "next-auth";
import bcrypt from "bcrypt";
import User from "@/models/users";

declare module "next-auth" {
  interface User {
    _id?: string;
    role?: string;
  }
  interface Session {
    user: User & {
      role?: string;
      id?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    id?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectToDatabase();

        // Find the user
        const user = await User.findOne({ email: credentials?.email });
        if (!user) return null; // Invalid email

        // Compare password
        const isMatch = await bcrypt.compare(
          credentials!.password,
          user.password
        );
        if (!isMatch) return null; // Invalid password

        // Return user with role
        return {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
          name: user.name,
        } as NextAuthUser & { role?: string };
      },
    }),
  ],
  callbacks: {
    async jwt({
      token,
      user,
    }: {
      token: JWT;
      user?: NextAuthUser & { role?: string };
    }) {
      if (user) {
        token.role = user.role;
        token.name = user.name;
        token.id = user.id; // Save role in JWT
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  session: { strategy: "jwt" }, // Use JWT for stateless sessions
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
