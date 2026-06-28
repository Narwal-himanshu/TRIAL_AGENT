"use client"

import { useState } from "react"

interface StudentFormProps {
  onSave: (data: any) => void
}

export default function StudentForm({ onSave }: StudentFormProps) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    name: "",
    current_year: "",
    branch: "",
    skills: "",
    programming_languages: "",
    interests: "",
    career_goals: "",
    dsa_problems_solved: "",
  })

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async () => {
    setLoading(true)
    setError("")
    try {
      const data = {
        name: form.name,
        current_year: form.current_year,
        branch: form.branch,
        skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
        programming_languages: form.programming_languages.split(",").map((s) => s.trim()).filter(Boolean),
        interests: form.interests,
        career_goals: form.career_goals,
        dsa_problems_solved: parseInt(form.dsa_problems_solved) || 0,
      }
      onSave(data)
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  if (step === 1) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Basic Info</h2>
        <input
          placeholder="Full Name"
          value={form.name}
          onChange={update("name")}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-gray-500 focus:outline-none"
        />
        <select
          value={form.current_year}
          onChange={update("current_year")}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-gray-500 focus:outline-none"
        >
          <option value="">Current Year</option>
          <option value="1st">1st Year</option>
          <option value="2nd">2nd Year</option>
          <option value="3rd">3rd Year</option>
          <option value="4th">4th Year</option>
        </select>
        <input
          placeholder="Branch (e.g. Computer Science)"
          value={form.branch}
          onChange={update("branch")}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-gray-500 focus:outline-none"
        />
        <input
          placeholder="Skills (comma separated)"
          value={form.skills}
          onChange={update("skills")}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-gray-500 focus:outline-none"
        />
        <input
          placeholder="Programming Languages (comma separated)"
          value={form.programming_languages}
          onChange={update("programming_languages")}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-gray-500 focus:outline-none"
        />
        <button
          onClick={() => setStep(2)}
          className="w-full rounded-lg bg-gray-900 px-4 py-2 text-white hover:bg-gray-800"
        >
          Next
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Goals & Progress</h2>
      <textarea
        placeholder="What are you interested in?"
        value={form.interests}
        onChange={update("interests")}
        rows={3}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-gray-500 focus:outline-none"
      />
      <textarea
        placeholder="What are your career goals?"
        value={form.career_goals}
        onChange={update("career_goals")}
        rows={3}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-gray-500 focus:outline-none"
      />
      <input
        placeholder="DSA Problems Solved"
        type="number"
        value={form.dsa_problems_solved}
        onChange={update("dsa_problems_solved")}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-gray-500 focus:outline-none"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-3">
        <button
          onClick={() => setStep(1)}
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 rounded-lg bg-gray-900 px-4 py-2 text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save & Analyze"}
        </button>
      </div>
    </div>
  )
}
