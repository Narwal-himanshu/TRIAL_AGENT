import Link from "next/link"

export default function LandingPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-4">
      <div className="max-w-2xl text-center">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900">
          AI Career Agent
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Get personalized career guidance powered by AI. Classify your skill
          level, discover career paths, and find curated learning content.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/signup"
            className="rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-gray-800"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Login
          </Link>
        </div>
      </div>
    </main>
  )
}
