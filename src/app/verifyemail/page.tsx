"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const VerifyEmail = () => {
  const [user, setUser] = useState({
    token: "",
  });
  const [isVerified, setIsVerified] = useState(false);

  const isUserEmailVerified = async () => {
    try {
      const response = await axios.post("api/auth/verifyemail", {
        token: user.token,
      });
      console.log(response);
      if (response?.data?.status === 200 && response?.data?.status < 300) {
        toast.success(response?.data?.message);
      } else {
        toast.error(response?.data?.error);
      }
      setIsVerified(true);
      return console.log(response);
    } catch (error: any) {
      toast.error(error);
      console.log(
        "Something went wrong when user trying to verify the email",
        error
      );
    }
  };

  useEffect(() => {
    const newURL = window.location.search.split("=")[1];
    setUser({ ...user, token: newURL });
  }, [user]);

  useEffect(() => {
    if (user.token.length > 0) {
      isUserEmailVerified();
    }

    if (user.token.length === 0) {
      setIsVerified(false);
    }
  }, [user.token]);

  return (
    <div className="text-black">
      {isVerified
        ? "Your email has been verified"
        : "There is some issue to verify your email"}
    </div>
  );
};

export default VerifyEmail;
