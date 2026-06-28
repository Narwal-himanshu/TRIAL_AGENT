"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCareerContext } from "@/context/CareerContext";
import TagInput from "@/components/TagInput";

export default function OnboardingPage() {
  const router = useRouter();
  const { setUserProfile, setRoadmapLength } = useCareerContext();

  const [name, setName] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [years, setYears] = useState(5);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Name is required.";
    if (!currentRole.trim()) newErrors.currentRole = "Current role is required.";
    if (!targetRole.trim()) newErrors.targetRole = "Target role is required.";
    if (!experience) newErrors.experience = "Experience is required.";
    if (skills.length === 0) newErrors.skills = "At least one skill is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setUserProfile({
        name,
        current_role: currentRole,
        target_role: targetRole,
        years_experience: Number(experience),
        skills,
      });
      setRoadmapLength(years);
      router.push("/roadmap");
    }
  };

  return (
    <main className="flex min-h-full items-center justify-center p-6 py-12 sm:py-24">
      <div className="w-full max-w-[560px]">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
            Your AI Career Roadmap
          </h1>
          <p className="mt-3 text-lg text-slate-500">
            Tell us where you are. We'll map where you're going.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-sm font-medium text-slate-900">
              Your Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jane Doe"
              className={`rounded-lg border bg-white p-2.5 text-sm outline-none transition-colors focus:border-slate-400 focus:ring-1 focus:ring-slate-400 ${
                errors.name ? "border-red-300" : "border-slate-200"
              }`}
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="currentRole" className="text-sm font-medium text-slate-900">
              Current Role
            </label>
            <input
              id="currentRole"
              type="text"
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value)}
              placeholder="e.g. Junior Developer"
              className={`rounded-lg border bg-white p-2.5 text-sm outline-none transition-colors focus:border-slate-400 focus:ring-1 focus:ring-slate-400 ${
                errors.currentRole ? "border-red-300" : "border-slate-200"
              }`}
            />
            {errors.currentRole && <p className="text-xs text-red-500">{errors.currentRole}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="targetRole" className="text-sm font-medium text-slate-900">
              Target Role
            </label>
            <input
              id="targetRole"
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Engineering Manager"
              className={`rounded-lg border bg-white p-2.5 text-sm outline-none transition-colors focus:border-slate-400 focus:ring-1 focus:ring-slate-400 ${
                errors.targetRole ? "border-red-300" : "border-slate-200"
              }`}
            />
            {errors.targetRole && <p className="text-xs text-red-500">{errors.targetRole}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="experience" className="text-sm font-medium text-slate-900">
              Years of Experience
            </label>
            <select
              id="experience"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className={`rounded-lg border bg-white p-2.5 text-sm outline-none transition-colors focus:border-slate-400 focus:ring-1 focus:ring-slate-400 ${
                errors.experience ? "border-red-300" : "border-slate-200"
              }`}
            >
              <option value="" disabled>Select experience...</option>
              <option value="0">0-1 years</option>
              <option value="1">1-3 years</option>
              <option value="3">3-5 years</option>
              <option value="5">5-10 years</option>
              <option value="10">10+ years</option>
            </select>
            {errors.experience && <p className="text-xs text-red-500">{errors.experience}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-900">
              Key Skills
            </label>
            <TagInput tags={skills} setTags={setSkills} error={!!errors.skills} />
            {errors.skills && <p className="text-xs text-red-500">{errors.skills}</p>}
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-slate-900">
              Roadmap Length
            </label>
            <div className="flex gap-3">
              {[3, 5, 10].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setYears(num)}
                  className={`flex-1 rounded-full border py-2 text-sm font-medium transition-colors ${
                    years === num
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {num} Years
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="mt-4 w-full rounded-xl bg-slate-900 py-3.5 text-base font-medium text-white transition-opacity hover:opacity-90 active:opacity-100"
          >
            Generate My Roadmap
          </button>
        </form>
      </div>
    </main>
  );
}
