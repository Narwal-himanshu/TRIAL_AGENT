"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { UserProfile, YearlyPlan } from "../types/career";

interface CareerContextType {
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile | null) => void;
  roadmapLength: number;
  setRoadmapLength: (length: number) => void;
  careerPlan: YearlyPlan[] | null;
  setCareerPlan: (plan: YearlyPlan[] | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  reset: () => void;
}

const CareerContext = createContext<CareerContextType | undefined>(undefined);

export function CareerProvider({ children }: { children: ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [roadmapLength, setRoadmapLength] = useState<number>(5);
  const [careerPlan, setCareerPlan] = useState<YearlyPlan[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setUserProfile(null);
    setRoadmapLength(5);
    setCareerPlan(null);
    setIsLoading(false);
    setError(null);
  };

  return (
    <CareerContext.Provider
      value={{
        userProfile,
        setUserProfile,
        roadmapLength,
        setRoadmapLength,
        careerPlan,
        setCareerPlan,
        isLoading,
        setIsLoading,
        error,
        setError,
        reset,
      }}
    >
      {children}
    </CareerContext.Provider>
  );
}

export function useCareerContext() {
  const context = useContext(CareerContext);
  if (context === undefined) {
    throw new Error("useCareerContext must be used within a CareerProvider");
  }
  return context;
}
