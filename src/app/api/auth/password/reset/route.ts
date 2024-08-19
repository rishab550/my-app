import { dbConnect } from "@/dbConfig/dbCongig";
import User from "@/models/usermodel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
dbConnect();

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
    const { password, token } = req;

    if (!token) {
      return NextResponse.json({
        error: "Invalid token",
        status: 400,
      });
    }

    const user = await User.findOne({
      forgotPasswordToken: token,
      forgotPasswordTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json({
        status: 400,
        error: "Invalid User",
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    user.password = hashedPassword;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordTokenExpiry = undefined;
    await user.save();

    return NextResponse.json({
      status: 200,
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({
      status: 500,
      error: error.message,
    });
  }
}
