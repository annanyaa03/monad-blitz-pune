import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          await connectToDatabase();

          const existingUser = await User.findOne({ email: user.email });

          if (!existingUser) {
            await User.create({
              googleId: user.id,
              name: user.name || "Unknown User",
              email: user.email || "",
              image: user.image || undefined,
            });
          } else {
            existingUser.lastLogin = new Date();
            await existingUser.save();
          }
        } catch (error) {
          // Log error but DO NOT block sign-in — MongoDB issues should not prevent login
          console.error("Warning: Could not save user to database:", error);
        }
        return true; // Always allow Google sign-in regardless of DB status
      }
      return false;
    },
    async jwt({ token, user, trigger, session }) {
      // Fetch the wallet address from MongoDB during initial login
      if (user) {
        try {
          await connectToDatabase();
          const dbUser = await User.findOne({ email: user.email }).lean();
          if (dbUser) {
            token.sub = dbUser._id.toString(); // Map MongoDB _id to sub
            token.walletAddress = dbUser.walletAddress;
          }
        } catch (error) {
          console.error("Warning: Could not fetch user from database:", error);
        }
      }

      // Update the token walletAddress when a specific trigger is fired from client side
      if (trigger === "update" && session?.walletAddress !== undefined) {
        token.walletAddress = session.walletAddress;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        (session.user as any).walletAddress = token.walletAddress as string | null | undefined;
      }
      return session;
    },
  },
});
