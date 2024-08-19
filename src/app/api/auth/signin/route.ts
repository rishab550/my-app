import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { SignJWT } from "jose";
import User from "@/models/usermodel";
import { dbConnect } from "@/dbConfig/dbCongig";
import { sendMail } from "@/helpers/sendMail";

dbConnect();

export async function POST(request: NextRequest) {
  try {
    const { email, password, number, otp } = await request.json();

    if (email) {
      const user = await User.findOne({ email });

      if (!user) {
        return NextResponse.json({
          error: "Invalid User",
          status: 400,
        });
      }

      const checkPassword = await bcryptjs.compare(password, user.password);

      if (!checkPassword) {
        return NextResponse.json({
          error: "Invalid Password, Please Enter the correct password",
          status: 400,
        });
      }

      if (!user.isVerified) {
        await sendMail({
          email: user.email,
          emailType: "Verify",
          userId: user._id,
        });

        return NextResponse.json({
          status: 400,
          error:
            "Please verify your email first, verification email already sent to your email",
        });
      }

      const tokenData = {
        email: user.email,
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
      };

      const token = await new SignJWT(tokenData)
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("1d")
        .sign(new TextEncoder().encode(process.env.TOKEN_SECRET!));

      const refreshToken = await new SignJWT(tokenData)
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("1d")
        .sign(new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET!));

      user.refreshToken = refreshToken;

      user.refreshTokenExpiry = Date.now() + 86400000; // Refresh token expiry (1 day)
      await user.save();

      const response = NextResponse.json({
        message: "User logged in successfully",
        status: 200,
        user: {
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
        },
      });

      response.cookies.set("token", token, { httpOnly: true });
      response.cookies.set("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
      });

      console.log("Response sent with new tokens.");
      return response;
    } else if (number) {
      const user = await User.findOne({ number });

      if (!user) {
        return NextResponse.json({
          error: "Invalid User",
          status: 400,
        });
      }

      console.log("OTP", otp);
      console.log("OTPUSER", user);

      if (user.otp !== parseInt(otp)) {
        return NextResponse.json({
          status: 400,
          error: "Invalid OTP",
        });
      } else {
        user.isVerified = true;
      }

      const tokenData = {
        number: user.number,
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
      };

      const token = await new SignJWT(tokenData)
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("1d")
        .sign(new TextEncoder().encode(process.env.TOKEN_SECRET!));

      const refreshToken = await new SignJWT(tokenData)
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("1d")
        .sign(new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET!));

      user.refreshToken = refreshToken;

      user.refreshTokenExpiry = Date.now() + 86400000; // Refresh token expiry (1 day)
      await user.save();

      const response = NextResponse.json({
        message: "User logged in successfully",
        status: 200,
        user: {
          number: user.number,
          firstname: user.firstname,
          lastname: user.lastname,
        },
      });

      response.cookies.set("token", token, { httpOnly: true });
      response.cookies.set("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
      });

      console.log("Response sent with new tokens.");
      return response;
    }
  } catch (error) {
    console.error("Something went wrong when user trying to login:", error);
    return NextResponse.json({
      error: "Something went wrong on the server side. User unable to login.",
      status: 500,
    });
  }
}
