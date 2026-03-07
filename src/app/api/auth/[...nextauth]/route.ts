import NextAuth from "next-auth";
import { getAuthOptions } from "@/lib/auth";

const handler = NextAuth({
  providers: (await getAuthOptions()).providers,
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: { signIn: "/", error: "/" },
  callbacks: {
    async signIn({ user, account, profile }) {
      const options = await getAuthOptions();
      const signInCallback = options.callbacks?.signIn;
      if (signInCallback) {
        return signInCallback({ user, account, profile, email: { verificationRequest: false } } as any);
      }
      return true;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      const options = await getAuthOptions();
      const jwtCallback = options.callbacks?.jwt;
      if (jwtCallback) {
        return jwtCallback({ token, user, account, profile, isNewUser } as any);
      }
      return token;
    },
    async session({ session, token, user }) {
      const options = await getAuthOptions();
      const sessionCallback = options.callbacks?.session;
      if (sessionCallback) {
        return sessionCallback({ session, token, user } as any);
      }
      return session;
    },
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      const options = await getAuthOptions();
      const signInEvent = options.events?.signIn;
      if (signInEvent) {
        return signInEvent({ user, account, profile, isNewUser } as any);
      }
    },
    async signOut({ token }) {
      const options = await getAuthOptions();
      const signOutEvent = options.events?.signOut;
      if (signOutEvent) {
        return signOutEvent({ token } as any);
      }
    },
  },
  debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST };
