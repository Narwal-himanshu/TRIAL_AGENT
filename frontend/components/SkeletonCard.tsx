"use client";

import React from "react";

export default function SkeletonCard() {
  return (
    <div className="card-shadow flex animate-pulse flex-col gap-6 rounded-xl border border-slate-100 bg-white p-6 sm:p-8">
      <div className="flex items-center gap-4">
        <div className="h-7 w-20 rounded bg-slate-200"></div>
        <div className="h-7 w-48 rounded bg-slate-200"></div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-3">
          <div className="h-5 w-16 rounded bg-slate-200"></div>
          <div className="flex flex-col gap-2">
            <div className="h-4 w-full rounded bg-slate-100"></div>
            <div className="h-4 w-5/6 rounded bg-slate-100"></div>
            <div className="h-4 w-full rounded bg-slate-100"></div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="h-5 w-16 rounded bg-slate-200"></div>
          <div className="flex flex-col gap-2">
            <div className="h-4 w-full rounded bg-slate-100"></div>
            <div className="h-4 w-full rounded bg-slate-100"></div>
            <div className="h-4 w-4/5 rounded bg-slate-100"></div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="h-5 w-24 rounded bg-slate-200"></div>
        <div className="flex flex-wrap gap-2">
          <div className="h-6 w-20 rounded-full bg-slate-100"></div>
          <div className="h-6 w-24 rounded-full bg-slate-100"></div>
          <div className="h-6 w-16 rounded-full bg-slate-100"></div>
        </div>
      </div>

      <div className="mt-2 h-20 w-full rounded-lg bg-slate-50 border border-slate-100"></div>
    </div>
  );
}
