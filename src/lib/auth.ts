import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from './db';

// AUTH_SECRET est requis en production. On fournit un secret de repli pour que
// l'app démarre en démo sans configuration — À REMPLACER par un vrai secret
// (openssl rand -base64 32) via la variable d'environnement AUTH_SECRET.
const AUTH_SECRET = process.env.AUTH_SECRET || 'demo-secret-a-remplacer-par-openssl-rand-base64-32';

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: AUTH_SECRET,
  // Cookie persistante : la session reste ouverte sur l'appareil jusqu'à la
  // déconnexion explicite (renouvelée à chaque activité, validité maximale 1 an).
  session: { strategy: 'jwt', maxAge: 60 * 60 * 24 * 365, updateAge: 60 * 60 * 24 },
  pages: { signIn: '/connexion' },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(creds) {
        const email = String(creds?.email ?? '').toLowerCase().trim();
        const password = String(creds?.password ?? '');
        if (!email || !password) return null;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;
        return { id: user.id, email: user.email, name: user.name ?? undefined, role: user.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.uid = (user as { id: string }).id;
        token.role = (user as { role?: string }).role ?? 'USER';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.uid as string;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
});
