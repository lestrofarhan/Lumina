import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter an email and password");
        }

        // 1. Find the user
        const user = await User.findOne({ email: credentials.email });
        if (!user) throw new Error("No user found with this email");

        // 2. Check password
        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordCorrect) throw new Error("Invalid password");

        // 3. Return user (this data goes into the JWT)
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role, // Important for Admin access
        };
      },
    }),
  ],
  callbacks: {
    // Save the role into the token
    async jwt({ token, user }) {
      if (user) token.role = (user as any).role;
      return token;
    },
    // Pass the role to the frontend session
    async session({ session, token }) {
      if (session.user) (session.user as any).role = token.role;
      return session;
    },
  },
  pages: {
    signIn: "/login", // Custom login page
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
