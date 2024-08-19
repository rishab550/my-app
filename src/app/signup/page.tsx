"use client";

import React, { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa6";
import { IoCaretForward } from "react-icons/io5";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

const SignUp = () => {
  const [user, setUser] = useState<any>({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    provider: "",
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data, status } = useSession();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    savingUser();
  };

  const savingUser = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/auth/signup", user);

      if (response.data.status >= 200 && response.data.status < 300) {
        toast.success(response.data.message);
        router.push("/signin");
      } else {
        throw new Error(response.data.error);
      }
    } catch (error: any) {
      console.log("Something went wrong while registering the user:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async (e: any) => {
    e.preventDefault();
    await signIn("google", { callbackUrl: "/home" });
  };

  const handleGithubSignIn = async (e: any) => {
    e.preventDefault();
    await signIn("github", { callbackUrl: "/home" });
  };

  return (
    <>
      <div className=" h-[calc(100vh-60px)] flex flex-col justify-center items-center bg-gray-50 max-sm:justify-normal max-sm:items-center max-sm:content-start">
        <div className=" flex flex-col p-6 max-w-sm  gap-2 shadow-xl content-center items-center justify-center rounded-lg bg-white ">
          <div className="text-center text-black ">
            <p>Create Your Account</p>
            <span className="text-sm">
              Welcome! Please fill in the details to get started{" "}
            </span>
          </div>
          <div className="flex justify-between gap-5 ">
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
            <div className="bg-violet-800 w-full p-1 rounded-md flex flex-row text-center justify-center items-center gap-4">
              Enter Your Details!
            </div>
          </div>
          <span className="text-center h-1">
            <br />
          </span>
          <div className="flex flex-row w-full gap-1">
            <div className="flex flex-col">
              <label className="text-black font-bold">First Name</label>
              <input
                className=" text-black p-1 w-full border rounded-sm"
                type="text"
                placeholder="Naxon..."
                required
                value={user.firstname}
                onChange={(e) =>
                  setUser({ ...user, firstname: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col jsutify-center">
              <label className="text-black font-bold">Last Name</label>
              <input
                className=" text-black p-1 w-full border rounded-sm"
                placeholder="tech..."
                required
                type="text"
                value={user.lastname}
                onChange={(e) => setUser({ ...user, lastname: e.target.value })}
              />
            </div>
          </div>
          <div className="flex flex-col w-full gap-1">
            <label className="text-black font-bold">Email Address</label>
            <input
              className="w-full text-black p-1"
              type="email"
              value={user.email}
              required
              placeholder="Enter your email here"
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
          </div>
          <div className="flex flex-col w-full  gap-1">
            <label className="text-black font-bold ">Password</label>
            <input
              className="w-full text-black p-1"
              required
              type="password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              placeholder="Enter your password here"
            />
          </div>
          <div className="w-full">
            <button
              className="bg-black w-full p-1 rounded-md flex flex-row text-center justify-center items-center gap-4"
              onClick={handleSubmit}
            >
              Continue
              <IoCaretForward />
            </button>
          </div>
        </div>
        <div className="bg-gray-200 flex flex-row px-16 py-2 text-black rounded-b-lg text-sm shadow-md border hover:bg-white">
          {" "}
          <Link href="http://localhost:3000/signin">
            Already have an account? Sign In
          </Link>
        </div>
      </div>
    </>
  );
};

export default SignUp;
