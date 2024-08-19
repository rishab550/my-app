import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { IoCaretForward } from "react-icons/io5";

const OTPLogin = () => {
  const router = useRouter();
  const [user, setUser] = useState({
    number: "",
    otp: "",
    firstname: "",
    lastname: "",
  });

  const [isOTPSent, setIsOTPSent] = useState(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    OTPSending();
  };

  const handleVerify = (e: any) => {
    e.preventDefault();
    checkOTP();
  };

  const checkOTP = async () => {
    try {
      try {
        const response = await axios.post("/api/auth/signin", user, {
          withCredentials: true, // Include cookies with the request
        });
        if (response.data.status >= 200 && response.data.status < 300) {
          toast.success(response?.data?.message);
          router.push("/home");
        } else {
          throw new Error(response.data.error);
        }
      } catch (error: any) {
        console.log("Error:", error.message);
        toast.error(error);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const OTPSending = async () => {
    try {
      const response = await axios.post("/api/auth/signin/otpverify", user);

      if (response.data.status >= 200 && response.data.status < 300) {
        toast.success(response?.data?.message);
        setIsOTPSent(true);
        console.log(response);
      } else {
        throw new Error(response.data.error);
      }
    } catch (error: any) {
      console.log(error, "There is some error while sending the OTP");
      toast.error(error.message);
    }
  };

  return (
    <>
      {isOTPSent ? (
        <div className="flex flex-col w-full gap-1">
          <label className="text-black font-bold">OTP</label>
          <input
            className="w-full text-black p-1"
            type="number"
            value={user.otp}
            onChange={(e) => setUser({ ...user, otp: e.target.value })}
            placeholder="Enter the OTP"
          />
        </div>
      ) : (
        <div className="flex flex-col w-full gap-1">
          <label className="text-black font-bold">First Name</label>
          <input
            className="w-full text-black p-1"
            type="text"
            value={user.firstname}
            placeholder="Enter your first name here"
            onChange={(e) => setUser({ ...user, firstname: e.target.value })}
          />
          <label className="text-black font-bold">Last Name</label>
          <input
            className="w-full text-black p-1"
            type="text"
            value={user.lastname}
            placeholder="Enter your last name here"
            onChange={(e) => setUser({ ...user, lastname: e.target.value })}
          />
          <label className="text-black font-bold">Phone Number</label>
          <input
            className="w-full text-black p-1"
            type="number"
            value={user.number}
            placeholder="Enter your phone number here"
            onChange={(e) =>
              setUser({ ...user, number: e.target.value.toString() })
            }
          />
        </div>
      )}

      <div className="w-full">
        {isOTPSent ? (
          <button
            className=" bg-black w-full p-1 rounded-md flex flex-row text-center justify-center items-center gap-4"
            onClick={handleVerify}
          >
            Verfiy
            <IoCaretForward />
          </button>
        ) : (
          <button
            className="bg-black w-full p-1 rounded-md flex flex-row text-center justify-center items-center gap-4"
            onClick={handleSubmit}
          >
            Send OTP
            <IoCaretForward />
          </button>
        )}
      </div>
    </>
  );
};

export default OTPLogin;
