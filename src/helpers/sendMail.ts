import { NextRequest } from "next/server";
import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";
import User from "@/models/usermodel";

export async function sendMail({ email, emailType, userId }: any) {
  try {
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    if (emailType === "Verify") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    }

    if (emailType === "ForgotPassword") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });
    }

    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "4201f95082b3a9",
        pass: "6da212eda2af44",
      },
    });

    const mailOptions = {
      to: email,
      from: "rishabhgarg1sep@gmail.com",
      subject:
        emailType === "Verify"
          ? "Please verify your email"
          : "Please reset your password",
      html: `<p>Click <a href="${process.env.DOMAIN}/${
        emailType === "Verify" ? "verifyemail" : "password/reset"
      }?token=${hashedToken}"> here</a> to ${
        emailType === "Verify" ? "Verify your email" : "reset your password"
      }  or paste the below link to ${
        emailType === "Verify" ? "Verify your email" : "reset your password"
      } </br>
      ${process.env.DOMAIN}/${
        emailType === "Verify" ? "verifyemail" : "password/reset"
      }?token=${hashedToken}
      </p>`,
    };

    const mailResponse = await transport.sendMail(mailOptions);
    return mailResponse;
  } catch (error) {
    console.error(error, "Error while sending the mail to the user");
  }
}
