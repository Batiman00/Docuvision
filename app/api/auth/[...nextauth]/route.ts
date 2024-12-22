import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import jwt from "jsonwebtoken";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials) {
            return null;
          }

          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signin`, {
            method: 'POST',
            body: JSON.stringify(credentials),
            headers: { 'Content-Type': 'application/json' }
          });
          const user = await res.json();
          if (res.ok && user.access_token) {
            return user;
          }
          return null;
        } catch (error) {
          console.log(error)
        }
      }
    }),
  ],
  pages: {
    signIn: "/auth/register",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
    async jwt({ token, user }) {
      if (user && user.access_token) {
        const decoded = jwt.decode(user.access_token) as unknown as { email: string, name: string, sub: string };
        token.accessToken = user.access_token;
        token.email = decoded.email;
        token.name = decoded.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.access_token = token.accessToken as string;
        session.user = {
          id: token.userId as string,
          email: token.email as string,
          name: token.name as string,
        };
      };
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };