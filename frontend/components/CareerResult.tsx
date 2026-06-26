"use client"

interface CareerResultProps {
  career: any
  onRefresh: () => void
  loading?: boolean
}

export default function CareerResult({ career, onRefresh, loading }: CareerResultProps) {
  if (loading) {
    return (
      <div className="animate-pulse space-y-3 rounded-lg border border-gray-200 p-6">
        <div className="h-6 w-3/4 rounded bg-gray-200" />
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-4 w-5/6 rounded bg-gray-200" />
      </div>
    )
  }

  if (!career) return null

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">{career.title}</h2>
        <p className="mt-2 text-gray-600">{career.description}</p>
      </div>

      <div>
        <h3 className="mb-2 font-semibold text-gray-900">Level: {career.level}</h3>
        <p className="text-sm text-gray-500">
          Timeline: {career.timeline_months} months • Roles: {career.recommended_roles?.join(", ")}
        </p>
      </div>

      <div>
        <h3 className="mb-3 font-semibold text-gray-900">Milestones</h3>
        <div className="space-y-2">
          {career.milestones?.map((m: any, i: number) => (
            <div key={i} className="flex items-center gap-3 rounded-lg border border-gray-200 p-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-sm font-bold text-white">
                {i + 1}
              </span>
              <div>
                <p className="font-medium text-gray-900">{m.name}</p>
                <p className="text-sm text-gray-500">{m.timeline_months} months</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-2 font-semibold text-gray-900">Skills to Learn</h3>
        <div className="flex flex-wrap gap-2">
          {career.skills_to_learn?.map((s: string, i: number) => (
            <span key={i} className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
              {s}
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={onRefresh}
        className="text-sm text-gray-500 hover:text-gray-900 underline"
      >
        Refresh Recommendation
      </button>
    </div>
  )
}
