"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCareerContext } from "@/context/CareerContext";
import { generateCareerPlan } from "@/lib/careerApi";
import YearCard from "@/components/YearCard";
import SkeletonCard from "@/components/SkeletonCard";

export default function RoadmapPage() {
  const router = useRouter();
  const {
    userProfile,
    roadmapLength,
    careerPlan,
    setCareerPlan,
    isLoading,
    setIsLoading,
    error,
    setError,
    reset,
  } = useCareerContext();

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Redirect if no profile data exists (e.g. user hard-refreshed /roadmap)
    if (!userProfile) {
      router.push("/");
      return;
    }

    const fetchPlan = async () => {
      // If we already have the plan for this user in context, don't refetch
      if (careerPlan && careerPlan.length === roadmapLength) return;

      setIsLoading(true);
      setError(null);
      try {
        const response = await generateCareerPlan({
          user_profile: userProfile,
          years: roadmapLength,
        });
        setCareerPlan(response.plan);
      } catch (err: any) {
        setError(err.message || "Failed to generate your roadmap.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlan();
  }, [userProfile, roadmapLength, careerPlan, setCareerPlan, setIsLoading, setError, router]);

  const handleStartOver = () => {
    reset();
    router.push("/");
  };

  const handleShare = () => {
    if (!careerPlan) return;
    const summary = `My ${roadmapLength}-Year Career Roadmap to ${userProfile?.target_role}:\n\n` +
      careerPlan.map((p) => `Year ${p.year}: ${p.title} - ${p.milestone}`).join("\n");

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Safe guard: Wait until the effect pushes to `/` if missing profile
  if (!userProfile) return null;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-12 flex flex-col items-start justify-between gap-6 border-b border-slate-100 pb-8 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            {userProfile.name}'s Roadmap
          </h1>
          <p className="mt-2 text-slate-500">
            Path to <strong className="font-medium text-slate-700">{userProfile.target_role}</strong>
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <button
            onClick={handleShare}
            disabled={isLoading || !!error}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50"
          >
            {copied ? "Copied!" : "Share"}
          </button>
          <button
            onClick={handleStartOver}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Start Over
          </button>
        </div>
      </header>

      {error ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50 p-12 text-center">
          <div className="mb-4 rounded-full bg-red-100 p-3">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-red-900">Something went wrong</h3>
          <p className="mb-6 text-red-700">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setIsLoading(true);
              generateCareerPlan({ user_profile: userProfile, years: roadmapLength })
                .then((res) => setCareerPlan(res.plan))
                .catch((err) => setError(err.message))
                .finally(() => setIsLoading(false));
            }}
            className="rounded-lg bg-red-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      ) : isLoading || !careerPlan ? (
        <div className="relative pl-6 before:absolute before:bottom-0 before:left-[35px] before:top-0 before:w-px before:-translate-x-1/2 before:bg-slate-100 sm:pl-12 sm:before:left-[59px]">
          <div className="flex flex-col gap-10">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-6 top-8 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-white bg-slate-200 ring-4 ring-white sm:-left-12"></div>
                <SkeletonCard />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="relative pl-6 before:absolute before:bottom-0 before:left-[35px] before:top-0 before:w-px before:-translate-x-1/2 before:bg-slate-100 sm:pl-12 sm:before:left-[59px]">
          <div className="flex flex-col gap-10">
            {careerPlan.map((plan, index) => {
              const isFirstYear = index === 0;
              return (
                <div
                  key={plan.year}
                  className="relative animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Timeline dot */}
                  <div
                    className={`absolute -left-6 top-8 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-white ring-4 ring-white transition-colors duration-500 sm:-left-12 ${
                      isFirstYear ? "bg-slate-900" : "bg-slate-300"
                    }`}
                  ></div>
                  <YearCard plan={plan} isActive={isFirstYear} />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
