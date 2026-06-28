"use client";

import React from "react";
import { YearlyPlan } from "@/types/career";

interface YearCardProps {
  plan: YearlyPlan;
  isActive?: boolean;
  style?: React.CSSProperties;
}

export default function YearCard({ plan, isActive, style }: YearCardProps) {
  return (
    <div
      style={style}
      className={`card-shadow flex flex-col gap-6 rounded-xl border border-slate-100 bg-white p-6 transition-opacity duration-500 sm:p-8 ${
        isActive ? "border-l-4 border-l-slate-900" : ""
      }`}
    >
      <div className="flex items-center gap-4">
        <span className="rounded bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
          Year {plan.year}
        </span>
        <h2 className="text-xl font-semibold text-slate-900">{plan.title}</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-3">
          <h3 className="font-semibold text-slate-900">Goals</h3>
          <ul className="flex flex-col gap-2 text-sm text-slate-600">
            {plan.goals.map((goal, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="mt-0.5 text-slate-400">•</span>
                <span>{goal}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-semibold text-slate-900">Actions</h3>
          <ul className="flex flex-col gap-2 text-sm text-slate-600">
            {plan.actions.map((action, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="mt-0.5 text-slate-400">•</span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="font-semibold text-slate-900">Skills to Learn</h3>
        <div className="flex flex-wrap gap-2">
          {plan.skills_to_learn.map((skill, idx) => (
            <span
              key={idx}
              className="rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 border border-slate-200"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-2 rounded-lg bg-slate-50 p-4 border border-slate-100">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
          Milestone
        </h3>
        <p className="text-sm font-medium text-slate-800">{plan.milestone}</p>
      </div>
    </div>
  );
}
