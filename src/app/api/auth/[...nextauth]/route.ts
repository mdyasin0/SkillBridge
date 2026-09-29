import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import type { JWT } from "next-auth/jwt";
import type { Session, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
type DBUser = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  photo: string;
  status: string;
};

export const authOptions: NextAuthOptions = {
  providers: [
     GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  }),
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) return null;

        const [rows] = await db.query(
          "SELECT * FROM users WHERE email = ?",
          [credentials.email]
        );

        const users = rows as DBUser[];
        const user = users[0];

        if (!user) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) return null;

        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.photo,
          status:user.status,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/auth/login",
  },

  callbacks: {
  async jwt({ token, user }) {
  if (user) {
    token.id = user.id;
    token.name = user.name ?? null;
    token.email = user.email ?? null;
    token.role = user.role;
    token.image = user.image ?? null;
     token.status = user.status ?? null;
  }

  if (token.id) {
    const [rows]: any = await db.query(
      `
      SELECT role, photo, name, email , status
      FROM users
      WHERE id = ?
      LIMIT 1
      `,
      [token.id],
    );

    if (rows.length > 0) {
      token.role = rows[0].role;
      token.image = rows[0].photo;
      token.name = rows[0].name;
      token.email = rows[0].email;
        token.status = rows[0].status;

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
    }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.role = token.role;
        session.user.image = token.image;
        session.user.status = token.status;
      }

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };