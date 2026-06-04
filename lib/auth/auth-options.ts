import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getServerSession } from "next-auth";
import { upsertOAuthUser } from "@/lib/auth/users";

const authSecret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const isGoogleConfigured = Boolean(googleClientId && googleClientSecret);

export const authOptions: NextAuthOptions = {
  providers: isGoogleConfigured
    ? [
        GoogleProvider({
          clientId: googleClientId!,
          clientSecret: googleClientSecret!,
        }),
      ]
    : [],
  secret: authSecret,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 14,
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google" || !user.email) return false;

      upsertOAuthUser({
        id: account.providerAccountId ?? user.id ?? user.email,
        email: user.email,
        displayName: user.name,
        image: user.image,
      });
      return true;
    },
    async jwt({ token, user, account }) {
      if (account?.provider === "google" && (user?.email || token.email)) {
        const appUser = upsertOAuthUser({
          id: account.providerAccountId ?? token.sub ?? user?.id ?? String(token.email),
          email: user?.email ?? String(token.email),
          displayName: user?.name,
          image: user?.image,
        });
        token.userId = appUser.id;
        token.username = appUser.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.userId ?? token.sub ?? "");
        session.user.username = typeof token.username === "string" ? token.username : undefined;
      }
      return session;
    },
  },
};

export function getAuthSession() {
  return getServerSession(authOptions);
}
