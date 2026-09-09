import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  session: { strategy: "jwt" },
  trustHost: true,
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = request.nextUrl;
      const isLogin = pathname.startsWith("/admin/login");
      const isAdmin = pathname.startsWith("/admin");

      if (isLogin) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/admin", request.nextUrl));
        }
        return true;
      }

      if (isAdmin) return isLoggedIn;
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = (token.role as string) || "VIEWER";
        session.user.id = (token.id as string) || "";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
