import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";
import { users, accounts, sessions, verificationTokens } from "@/db/schema";
import { eq } from "drizzle-orm";

const adminEmails = process.env.ADMIN_EMAILS?.split(",") ?? [];

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (user.email && adminEmails.includes(user.email)) {
        await db
          .update(users)
          .set({ isAdmin: true })
          .where(eq(users.email, user.email));
      }
      return true;
    },
    async session({ session, user }) {
      const dbUser = await db.query.users.findFirst({
        where: eq(users.id, user.id),
      });

      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          isAdmin: dbUser?.isAdmin ?? false,
        },
      };
    },
  },
  pages: {
    signIn: "/login",
  },
  trustHost: true,
});
