"use client";

import { createContext, useContext } from "react";

export const LivePriceContext = createContext<number | undefined>(undefined);

export const useLivePrice = () => useContext(LivePriceContext);
