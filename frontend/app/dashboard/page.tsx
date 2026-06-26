"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { auth } from "@/lib/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import {
  getStudentProfile,
  saveStudentProfile,
  classifyLevel,
  getCareerRecommendation,
} from "@/lib/api"
import StudentForm from "@/components/StudentForm"
import CareerResult from "@/components/CareerResult"
import ContentFeed from "@/components/ContentFeed"

export default function DashboardPage() {
  const [user, loading] = useAuthState(auth)
  const router = useRouter()
  const [profileExists, setProfileExists] = useState(false)
  const [profileLoading, setProfileLoading] = useState(true)
  const [classifying, setClassifying] = useState(false)
  const [recommending, setRecommending] = useState(false)
  const [career, setCareer] = useState<any>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.push("/login")
      return
    }
    checkProfile(user.uid)
  }, [user, loading])

  const checkProfile = async (uid: string) => {
    setProfileLoading(true)
    try {
      const profile = await getStudentProfile(uid)
      setProfileExists(!!profile.name)
    } catch {
      setProfileExists(false)
    } finally {
      setProfileLoading(false)
    }
  }

  const handleSave = async (data: any) => {
    setError("")
    await saveStudentProfile(data)
    setProfileExists(true)
    setClassifying(true)
    try {
      await classifyLevel(data.firebase_uid)
    } catch (err: any) {
      setError("Classification failed: " + err.message)
      setClassifying(false)
      return
    }
    setClassifying(false)
    setRecommending(true)
    try {
      const result = await getCareerRecommendation(data.firebase_uid)
      setCareer(result)
    } catch (err: any) {
      setError("Recommendation failed: " + err.message)
    } finally {
      setRecommending(false)
    }
  }

  const refreshRecommendation = async () => {
    if (!user) return
    setRecommending(true)
    setError("")
    try {
      await classifyLevel(user.uid)
      const result = await getCareerRecommendation(user.uid)
      setCareer(result)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setRecommending(false)
    }
  }

  if (loading || profileLoading) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-900 border-t-transparent" />
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold text-gray-900">Dashboard</h1>
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              {profileExists ? "Update Profile" : "Complete Your Profile"}
            </h2>
            {!profileExists ? (
              <StudentForm firebaseUid={user!.uid} onSave={handleSave} />
            ) : (
              <button
                onClick={() => setProfileExists(false)}
                className="text-sm text-gray-500 hover:text-gray-900 underline"
              >
                Edit Profile
              </button>
            )}
          </div>
          {classifying && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
              Classifying your skill level...
            </div>
          )}
          {recommending && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
              Generating career recommendation...
            </div>
          )}
        </div>
        <div className="space-y-6">
          {career && (
            <div className="rounded-lg border border-gray-200 p-6">
              <CareerResult
                career={career}
                onRefresh={refreshRecommendation}
                loading={recommending}
              />
            </div>
          )}
          {career && (
            <div className="rounded-lg border border-gray-200 p-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Curated Content
              </h2>
              <ContentFeed firebaseUid={user!.uid} />
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
