import twilio from "twilio";
import crypto from "crypto";
import User from "@/models/usermodel";

const accountSid = "AC3069bb714a7f3449ee83bb19181fc31d";
const authToken = "d2760d62cfd8c728ecf1967d152fa086";

export async function sendOTP({ number, userId }: any) {
  try {
    const client: any = twilio(accountSid, authToken);

    const otp = crypto.randomInt(100000, 999999);

    await User.findByIdAndUpdate(userId, {
      otp: otp,
    });

    const response = await client.messages.create({
      body: `Your OTP code is ${otp}`,
      from: "+14696450289",
      to: `+91${number}`,
    });

    return response;
  } catch (error) {
    console.log(
      error,
      "Something went wrong while sending the otp to the user"
    );
  }
}
