import { createContext, useContext } from "react";

interface ScrollContextType {
  progress: number;
}

export const ScrollContext = createContext<ScrollContextType>({ progress: 0 });
export const useScrollProgress = () => useContext(ScrollContext);
