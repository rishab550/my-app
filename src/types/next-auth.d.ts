import { JWT as NextAuthJWT } from "next-auth/jwt";
import NextAuth from "next-auth";

declare module "next-auth/jwt" {
  interface JWT {
    id?: String;
    email?: String;
    firstname?: String;
    lastname?: String;
    token?: {};
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      id?: String;
      email?: String;
      firstname?: String;
      lastname?: String;
      image?: String | null;
      token?: {};
    };
  }
}
