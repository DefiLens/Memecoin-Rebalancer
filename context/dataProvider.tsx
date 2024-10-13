"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import BigNumber from "bignumber.js";
BigNumber.config({ DECIMAL_PLACES: 10 });

export const DataContext = createContext<any | null>(null);

const DataProvider = ({ children }: any) => {
  const [a, setA] = useState("Aaaaaaaaa");
  return (
    <DataContext.Provider
      value={{
        a
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const DataState = () => {
  return useContext(DataContext);
};

export default DataProvider;
