import { dbConnect } from "@/dbConfig/dbCongig";
import { sendMail } from "@/helpers/sendMail";
import User from "@/models/usermodel";
import { NextRequest, NextResponse } from "next/server";

dbConnect();

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
    const { email } = req;

    console.log(email, "email");

    if (!email) {
      return NextResponse.json({
        error: "Invalid email",
        status: 400,
      });
    }

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return NextResponse.json({
        status: 400,
        error:
          "Invalid User, there is no account on our site with this email address",
      });
    }

    if (user.provider !== "mail") {
      return NextResponse.json({
        status: 400,
        error:
          "Invalid User, You have not created your account using email signUp",
      });
    }

    await sendMail({
      email: user.email,
      emailType: "ForgotPassword",
      userId: user._id,
    });

    return NextResponse.json({
      status: 200,
      message:
        "Email Sent! Please check your email inbox to reset your password",
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({
      status: 500,
      error: error.message,
    });
  }
}
