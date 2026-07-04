import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { walletAddress } = body;

    await connectToDatabase();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Only update if it changed
    if (user.walletAddress !== walletAddress) {
      user.walletAddress = walletAddress || null;
      await user.save();
    }

    return NextResponse.json({ success: true, walletAddress: user.walletAddress });
  } catch (error) {
    console.error("Error updating wallet address:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
