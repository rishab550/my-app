"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const Header = () => {
  const router = useRouter();

  const handleSignIn = (e: any) => {
    e.preventDefault();
    router.push("/signin");
  };

  const handleSignUp = (e: any) => {
    e.preventDefault();
    router.push("/signup");
  };
  return (
    <div className="w-full h-4rem flex flex-row p-4 justify-between bg-white shadow-md max-sm:flex-col max-sm:shadow-none max-sm:justfiy-center max-sm:items-center  max-sm:gap-2 ">
      <div className="flex gap-2 ">
        <div className="bg-purple-600 px-1 flex justify-center items-center rounded-md hover:bg-purple-800">
          <Image
            src={"brackets-curly-thin-svgrepo-com.svg"}
            alt="logo"
            height={24}
            width={24}
          />
        </div>
        <h1 className="text-lg text-black">
          Snippet <span className="text-purple-800">Master </span>
        </h1>
      </div>
      <div className="flex gap-2 max-sm:flex-col max-sm:mt-6 max-sm:justify-center max-sm:items-center">
        <button
          className="bg-purple-600 w-full px-4 text-white rounded-sm cursor-pointer hover:bg-purple-800 max-sm:full max-sm:px-28 max-sm:py-2 max-sm:text-xl max-sm:hidden"
          onClick={handleSignIn}
        >
          SignIn{" "}
        </button>
        <button
          className="bg-purple-600 w-full px-4 text-white rounded-sm cursor-pointer hover:bg-purple-800 max-sm:full max-sm:px-28 max-sm:py-2 max-sm:text-xl max-sm:hidden"
          onClick={handleSignUp}
        >
          SignUp
        </button>
      </div>
    </div>
  );
};

export default Header;
