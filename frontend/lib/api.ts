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

export async function loginWithFirebase(idToken: string) {
  return fetchAPI("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ id_token: idToken }),
  })
}

export async function saveStudentProfile(data: {
  firebase_uid: string
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

export async function getStudentProfile(firebaseUid: string) {
  return fetchAPI(`/api/student/profile/${firebaseUid}`)
}

export async function classifyLevel(firebaseUid: string) {
  return fetchAPI("/api/career/classify", {
    method: "POST",
    body: JSON.stringify({ firebase_uid: firebaseUid }),
  })
}

export async function getCareerRecommendation(firebaseUid: string) {
  return fetchAPI("/api/career/recommend", {
    method: "POST",
    body: JSON.stringify({ firebase_uid: firebaseUid }),
  })
}

export async function getContentFeed(firebaseUid: string) {
  return fetchAPI("/api/content/feed", {
    method: "POST",
    body: JSON.stringify({ firebase_uid: firebaseUid }),
  })
}
