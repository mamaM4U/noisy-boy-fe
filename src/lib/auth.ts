import { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        id:{
            type: "number",
        },
        email:{
            type: "text",
        },
        name:{
            type: "text",
        },
        token:{
            type: "text",
        }
      },
      authorize: async (credentials, req) => {
        return credentials||null;
      },
    }),
  ],
  callbacks: {
    jwt: async ({ user, token}) => {
      if (user) {
        token.id = +user.id;
        token.token = user.token;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if(session?.user){
        session.user.id = token.id as number;
        session.user.token = token.token as number;
      }
      return session;
    },
  }
};