import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    access_token?: string;
  }

  interface Session {
    user: User;
    access_token?: string;
  }
}
