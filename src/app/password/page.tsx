"use client";

import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";

const PasswordMail = () => {
  const [user, setUser] = useState({
    email: "",
  });

  const handleSumbit = (e: any) => {
    e.preventDefault();
    handleEmail();
    console.log(user.email);
  };

  const handleEmail = async () => {
    try {
      const response = await axios.post("/api/auth/password", user);
      console.log(response);

      if (user.email.length === 0) {
        throw new Error("please enter your email address");
      }

      if (response.data.status === 200 && response.data.status < 300) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.error);
      }

      return response;
    } catch (error: any) {
      console.log(
        error,
        "Something went wrong when sending the email to reset the password"
      );
      toast.error(error.message);
    }
  };

  return (
    <div>
      <div className="h-[calc(100vh-60px)] flex flex-col justify-center items-center bg-gray-50 max-sm:justify-normal max-sm:items-center max-sm:content-start">
        <div className="flex flex-col p-6 gap-2 shadow-xl content-center items-center justify-center rounded-lg bg-white w-1/2 max-sm:w-1/2 max-md:w-1/2 max-lg:w-1/2 max-sm:mt-10">
          <div className="flex flex-col w-full gap-1">
            <label className="text-black font-bold">Email</label>
            <input
              className="w-full text-black p-3"
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              placeholder="Enter your email address"
            />
          </div>

          <div className="w-full">
            <button
              onClick={handleSumbit}
              className="bg-black w-full p-1 rounded-md flex flex-row text-center justify-center items-center gap-4"
            >
              Change Your Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordMail;
