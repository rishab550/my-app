import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, "Please Enter the firstname"],
    },
    lastname: {
      type: String,
      required: [true, "Please Enter the lastname"],
    },
    number: {
      type: Number,
    },
    provider: {
      type: String,
      required: [true, "Please confirm the provider name"],
    },
    email: {
      type: String,
      match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    password: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    verifyToken: String,
    verifyTokenExpiry: Date,
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    refreshToken: String,
    refreshTokenExpiry: Date,
    otp: Number,
    otpExpiry: Date,
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
