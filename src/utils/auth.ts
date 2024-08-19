import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";
import { NextAuthOptions, Session } from "next-auth";
import User from "@/models/usermodel";
import GithubProvider from "next-auth/providers/github";

const GOOGLE_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const GITHUB_ID = process.env.GITHUB_CLIENT_ID!;
const GITHUB_SECRET = process.env.GITHUB_CLIENT_SECRET!;

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 20,
  },
  providers: [
    GoogleProvider({
      clientId: GOOGLE_ID,
      clientSecret: GOOGLE_SECRET,
    }),
    GithubProvider({
      clientId: GITHUB_ID,
      clientSecret: GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async jwt({
      token,
      account,
      user,
    }: {
      token: JWT;
      account?: any;
      user?: any;
    }): Promise<JWT> {
      if (account?.provider === "google") {
        try {
          const isUserStored = await User.findOne({ email: user.email });

          if (!isUserStored) {
            const userAdding = await User.create({
              email: user.email,
              firstname: user.name.split(" ")[0],
              lastname: user.name.split(" ")[1] || user.name.split(" ")[0],
              provider: account.provider,
              isVerified: true,
            });

            if (!userAdding) {
              throw new Error(
                "Unable to create a new user due to database connection"
              );
            }

            token.id = userAdding._id.toString();
          } else {
            token.id = isUserStored._id.toString();
          }

          token.email = user.email;
          token.firstname = user.name.split(" ")[0];
          (token.lastname = user.name.split(" ")[1] || user.name.split(" ")[0]),
            console.log("JWT Callback:", token);
        } catch (error) {
          console.error("Error in JWT callback:", error);
          throw new Error("Unable to fetch the details from the database");
        }
      } else if (account?.provider === "github") {
        try {
          const isUserStored = await User.findOne({ email: user.email });

          if (!isUserStored) {
            const userAdding = await User.create({
              email: user.email,
              firstname: user.name.split(" ")[0],
              lastname: user.name.split(" ")[1] || user.name.split(" ")[0],
              provider: account.provider,
              isVerified: true,
            });

            token.id = userAdding._id.toString();
          } else {
            token.id = isUserStored._id.toString();
          }

          token.email = user.email;
          token.firstname = user.name.split(" ")[0];
          (token.lastname = user.name.split(" ")[1] || user.name.split(" ")[0]),
            console.log("JWT Callback:", token);
        } catch (error) {
          console.error("Error in JWT callback:", error);
          throw new Error("Unable to fetch the details from the database");
        }
      }
      return token;
    },
    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
    }): Promise<Session> {
      session.user = {
        ...session.user,
        id: token.id as string,
        email: token.email as string,
        firstname: token.firstname as string,
        lastname: token.lastname as string,
      };
      return session;
    },
  },
};
