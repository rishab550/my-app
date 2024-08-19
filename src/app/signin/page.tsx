"use client";

import React, { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa6";
import { IoCaretForward } from "react-icons/io5";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import OTPLogin from "@/component/OTPLogin/page";

const SignIn = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
    firstname: "",
    lastname: "",
  });

  const [isSignWithOTP, setIsSignInWithOTP] = useState(false);

  const router = useRouter();

  const { data, status }: any = useSession();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signInOn();
  };

  const signInOn = async () => {
    try {
      const response = await axios.post("/api/auth/signin", user, {
        withCredentials: true, // Include cookies with the request
      });
      if (response.data.status >= 200 && response.data.status < 300) {
        toast.success(response?.data?.message);
        router.push("/home");
        console.log(response);
      } else {
        throw new Error(response.data.error);
      }
    } catch (error: any) {
      console.log("Error:", error.message);
      toast.error(error.message);
    }
  };

  const handleForgotPassword = (e: any) => {
    e.preventDefault();
    router.push("/password");
  };

  const handleGoogleSignIn = async (e: any) => {
    e.preventDefault();
    await signIn("google", { callbackUrl: "/home" });
  };

  const handleGithubSignIn = async (e: any) => {
    e.preventDefault();
    await signIn("github", { callbackUrl: "/home" });
  };

  const handleOTPLogin = (e: any) => {
    e.preventDefault();
    setIsSignInWithOTP(true);
  };

  return (
    <>
      <div className="h-[calc(100vh-60px)] flex flex-col justify-center items-center bg-gray-50 max-sm:justify-normal max-sm:items-center max-sm:content-start">
        <div className="flex flex-col p-6 gap-2 shadow-xl content-center items-center justify-center rounded-lg bg-white">
          <div className="text-center text-black">
            <p>
              Sign in to Snippet <span className="text-purple-800">Master</span>
            </p>
            <span className="text-sm">Welcome back to my application</span>
          </div>
          <div className="flex justify-between gap-5">
            <button
              className="text-black bg-white px-8 py-1 flex flex-row justify-center items-center gap-2 rounded-md border shadow-md hover:bg-slate-50"
              onClick={handleGoogleSignIn}
            >
              <FcGoogle className="h-4" />
              Google
            </button>
            <button
              className="text-black bg-white px-8 flex py-1 flex-row justify-center items-center gap-2 rounded-md border shadow-md hover:bg-slate-50"
              onClick={handleGithubSignIn}
            >
              <FaGithub />
              GitHub
            </button>
          </div>
          <span className="text-center h-1">
            <br />
          </span>
          <div className="w-full">
            <button
              className="bg-black w-full p-1 rounded-md flex flex-row text-center justify-center items-center gap-4"
              onClick={handleOTPLogin}
            >
              SignUp using Mobile Number
              <IoCaretForward />
            </button>
          </div>
          <span className="text-center h-1">
            <br />
          </span>
          {isSignWithOTP ? (
            <OTPLogin />
          ) : (
            <>
              {" "}
              <div className="flex flex-col w-full gap-1">
                <label className="text-black font-bold">Email Address</label>
                <input
                  className="w-full text-black p-1"
                  type="email"
                  value={user.email}
                  placeholder="Enter your email here"
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                />
              </div>
              <div className="flex flex-col w-full gap-1">
                <label className="text-black font-bold">Password</label>
                <input
                  className="w-full text-black p-1"
                  type="password"
                  value={user.password}
                  onChange={(e) =>
                    setUser({ ...user, password: e.target.value })
                  }
                  placeholder="Enter your password here"
                />
              </div>
              <div className="w-full">
                <button
                  className="bg-black w-full p-1 rounded-md flex flex-row text-center justify-center items-center gap-4"
                  onClick={handleSubmit}
                >
                  Sign In
                  <IoCaretForward />
                </button>
              </div>
              <div className="w-full">
                <button
                  className="bg-violet-600 w-full p-1 rounded-md flex flex-row text-center justify-center items-center gap-4"
                  onClick={handleForgotPassword}
                >
                  Forgot Password
                  <IoCaretForward />
                </button>
              </div>
            </>
          )}
        </div>
        <div className="bg-gray-200 flex flex-row px-16 py-2 text-black rounded-b-lg text-sm shadow-sm border hover:bg-white">
          <Link href="/signup">Don't have an Account? Sign Up</Link>
        </div>
      </div>
    </>
  );
};

export default SignIn;
