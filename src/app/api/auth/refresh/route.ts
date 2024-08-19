import { dbConnect } from "@/dbConfig/dbCongig";
import User from "@/models/usermodel";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

dbConnect();

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    const refreshToken = authHeader?.startsWith("Bearer")
      ? authHeader.substring(7)
      : null;

    console.log(refreshToken, "refreshToken");

    if (!refreshToken) {
      return NextResponse.json({
        status: 400,
        error: "Invalid refreshToken",
      });
    }

    const user = await User.findOne({
      refreshToken,
    });

    if (!user) {
      return NextResponse.json({
        status: 400,
        error: "Invalid user",
      });
    }

    console.log("user:", user);

    const tokenData = {
      email: user.email,
      id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
    };

    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "1h",
    });

    const response = NextResponse.json({
      status: 200,
      message: "token value updated successfully",
      token,
    });

    response.cookies.set("token", token, { httpOnly: true });
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      status: 500,
      error: "Unable to refresh the token",
    });
  }
}
