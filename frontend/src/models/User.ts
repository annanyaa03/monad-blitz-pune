import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  googleId: string;
  name: string;
  email: string;
  image?: string;
  walletAddress?: string | null;
  role: string;
  preferences: Record<string, any>;
  portfolioSettings: Record<string, any>;
  notificationSettings: Record<string, any>;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    googleId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    walletAddress: { type: String, default: null },
    role: { type: String, default: "user" },
    preferences: { type: Schema.Types.Mixed, default: {} },
    portfolioSettings: { type: Schema.Types.Mixed, default: {} },
    notificationSettings: { type: Schema.Types.Mixed, default: {} },
    lastLogin: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Prevent mongoose from compiling the model multiple times during hot-reloads in Next.js
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
