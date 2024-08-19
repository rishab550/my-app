"use client";

import { createContext } from "react";
import React, { ReactNode, useState } from "react";

export const StoreContext: any = createContext("");

interface StoreContextProviderProps {
  children: ReactNode;
}

const StoreContextProvider = ({ children }: StoreContextProviderProps) => {
  const [value, setValue] = useState("");
  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
};

export default StoreContextProvider;
