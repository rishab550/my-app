import { sendOTP } from "@/helpers/sendOTP";
import User from "@/models/usermodel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();

    const { number, firstname, lastname } = req;

    const existingUser = await User.findOne({ number });

    if (existingUser) {
      if (existingUser.isVerified)
        return NextResponse.json({
          status: 400,
          error: "Another user is already verified with this mobile number",
        });
    } else {
      const user = await new User({
        number,
        provider: "number",
        firstname,
        lastname,
      });

      const savedUser = await user.save();
      await sendOTP({ number, userId: user._id });

      return NextResponse.json({
        message: "OTP has been sent successfully",
        status: 200,
        user: savedUser,
      });
    }

    console.log(existingUser, "Existing User");
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({
      error:
        "Something went wrong while fetching the details from the database",
      status: 500,
    });
  }
}
