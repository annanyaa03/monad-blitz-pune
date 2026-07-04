import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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
          return true;
        } catch (error) {
          console.error("Error saving user to database:", error);
          return false;
        }
      }
      return false;
    },
    async jwt({ token, user, trigger, session }) {
      // Fetch the wallet address from MongoDB during initial login
      if (user) {
        await connectToDatabase();
        const dbUser = await User.findOne({ email: user.email }).lean();
        if (dbUser) {
          token.sub = dbUser._id.toString(); // Map MongoDB _id to sub
          token.walletAddress = dbUser.walletAddress;
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
