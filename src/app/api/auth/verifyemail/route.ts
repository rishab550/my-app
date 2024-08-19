import { dbConnect } from "@/dbConfig/dbCongig";
import User from "@/models/usermodel";
import { NextRequest, NextResponse } from "next/server";
import bcryptsjs from "bcryptjs";

dbConnect();

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
    const { token } = req;

    if (!token) {
      return NextResponse.json({
        status: 400,
        message: "Invalid token",
      });
    }

    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json({
        status: 400,
        message: "Invalid User",
      });
    }

    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;
    await user.save();

    const response = NextResponse.json({
      status: 200,
      message: "Your email have been verified successfully",
    });

    return response;
  } catch (error: any) {
    console.log(
      error,
      "Something went wrong while verifying the user mail at route api/verifyemail/route.ts"
    );
    return NextResponse.json({
      status: 500,
      error: error.message,
    });
  }
}
