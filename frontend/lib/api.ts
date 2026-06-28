const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Request failed" }))
    throw new Error(error.detail || `HTTP ${res.status}`)
  }
  return res.json()
}

export async function saveStudentProfile(data: {
  name: string
  current_year: string
  branch: string
  skills: string[]
  programming_languages: string[]
  interests: string
  career_goals: string
  dsa_problems_solved: number
}) {
  return fetchAPI("/api/student/profile", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function getStudentProfile() {
  return fetchAPI(`/api/student/profile`)
}

export async function classifyLevel() {
  return fetchAPI("/api/career/classify", {
    method: "POST",
  })
}

export async function getCareerRecommendation() {
  return fetchAPI("/api/career/recommend", {
    method: "POST",
  })
}

export async function getContentFeed() {
  return fetchAPI("/api/content/feed", {
    method: "POST",
  })
}
