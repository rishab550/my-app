import { dbConnect } from "@/dbConfig/dbCongig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/usermodel";
import bcryptjs from "bcryptjs";
import { sendMail } from "@/helpers/sendMail";

dbConnect();

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();

    const { firstname, lastname, email, password } = req;

    if (!firstname || !lastname || !email || !password) {
      return NextResponse.json({
        status: 400,
        error: "All fields are required",
      });
    }

    const checkUserEmail = await User.findOne({ email });

    if (checkUserEmail) {
      return NextResponse.json({
        status: 400,
        error:
          "Account already created with this email, please try with other one",
      });
    }

    if (password.length < 6) {
      return NextResponse.json({
        error: "Password must be atlest 6 characters",
        status: 400,
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const user = await new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      provider: "mail",
    });

    const savedUser = await user.save();
    await sendMail({
      email: savedUser.email,
      emailType: "Verify",
      userId: savedUser._id,
    });

    return NextResponse.json({
      status: 200,
      message: "Your account has been created successfully",
      success: true,
      savedUser,
    });
  } catch (error: any) {
    console.error("Error during user registration:", error);
    return NextResponse.json({
      status: 500,
      error:
        "Internal Server Error. Something went wrong while registering the user.",
    });
  }
}
