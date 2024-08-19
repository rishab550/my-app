"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const PasswordReset = () => {
  const router = useRouter();
  const [user, setUser] = useState({
    password: "",
    confirmPassword: "",
    token: "",
  });

  const handleSumbit = (e: any) => {
    e.preventDefault();
    if (user.password !== user.confirmPassword) {
      return toast.error("new password must be same as confirm password");
    }
    handlePassword();
    console.log(user.password, user.confirmPassword);
  };

  const handlePassword = async () => {
    try {
      const response = await axios.post("/api/auth/password/reset", user);

      if (response.data.status === 200 && response.data.status < 300) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.error);
      }
      // router.push("/signin");
      return response;
    } catch (error: any) {
      console.log(
        error,
        "Something went wrong when user trying to set a new password"
      );
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const newURL = window.location.search.split("=")[1];
    setUser({ ...user, token: newURL });
  }, []);

  return (
    <div>
      {" "}
      <div className="h-[calc(100vh-60px)] flex flex-col justify-center items-center bg-gray-50 max-sm:justify-normal max-sm:items-center max-sm:content-start">
        <div className="flex flex-col p-6 gap-2 shadow-xl content-center items-center justify-center rounded-lg bg-white w-1/2 max-sm:w-1/2 max-md:w-1/2 max-lg:w-1/2 max-sm:mt-10">
          <div className="flex flex-col w-full gap-1">
            <label className="text-black font-bold">Password</label>
            <input
              className="w-full text-black p-3"
              type="password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              placeholder="Enter your new password"
            />
          </div>
          <div className="flex flex-col w-full gap-1">
            <label className="text-black font-bold">Confirm Password</label>
            <input
              className="w-full text-black p-3"
              type="password"
              value={user.confirmPassword}
              onChange={(e) =>
                setUser({ ...user, confirmPassword: e.target.value })
              }
              placeholder="Enter your confirm password here"
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

export default PasswordReset;
