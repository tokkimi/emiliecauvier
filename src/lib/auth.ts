import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from './db';
import { allowAttempt, attemptKey, passwordVersion, signingSecret } from './security';

// Lazy configuration: builds do not require secrets; production requests fail closed.
export const { handlers, auth, signIn, signOut } = NextAuth(() => ({
  trustHost: true,
  secret: signingSecret(),
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
        if (!email || email.length > 254 || !password || Buffer.byteLength(password, 'utf8') > 72) return null;
        if (!allowAttempt(attemptKey('login', email), 20)) return null;
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
      if (typeof token.uid !== 'string') return null;
      const current = await prisma.user.findUnique({ where: { id: token.uid }, select: { role: true, name: true, passwordHash: true } });
      if (!current) return null;
      const version = passwordVersion(current.passwordHash);
      if (typeof token.passwordVersion === 'string' && token.passwordVersion !== version) return null;
      token.passwordVersion = version;
      token.role = current.role;
      token.name = current.name;
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
}));
