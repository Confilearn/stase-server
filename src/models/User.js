import mongoose from "mongoose";

/**
 * User schema for the Stase fintech application
 * Defines the structure for user accounts with authentication and profile information
 */
const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    transactionPin: {
      type: String,
      required: true,
    },
    clerkUserId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * User model - represents a user in the Stase fintech system
 */
const User = mongoose.model("User", UserSchema);

export default User;
