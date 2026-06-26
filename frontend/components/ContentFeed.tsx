"use client"

import { useEffect, useState } from "react"

interface ContentFeedProps {
  firebaseUid: string
}

export default function ContentFeed({ firebaseUid }: ContentFeedProps) {
  const [feed, setFeed] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!firebaseUid) return
    fetchFeed()
  }, [firebaseUid])

  const fetchFeed = async () => {
    setLoading(true)
    setError("")
    try {
      const { getContentFeed } = await import("@/lib/api")
      const data = await getContentFeed(firebaseUid)
      setFeed(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-5 w-1/3 rounded bg-gray-200" />
        <div className="h-20 rounded bg-gray-200" />
        <div className="h-20 rounded bg-gray-200" />
      </div>
    )
  }

  if (error) {
    return <p className="text-sm text-red-600">Failed to load content: {error}</p>
  }

  const sections = [
    { key: "internships", title: "Internships", icon: "💼" },
    { key: "hackathons", title: "Hackathons", icon: "🏆" },
    { key: "ctfs", title: "CTF Competitions", icon: "🛡️" },
    { key: "courses", title: "Recommended Courses", icon: "📚" },
  ]

  return (
    <div className="space-y-6">
      {sections.map(({ key, title, icon }) => {
        const items = feed?.[key]
        if (!items || items.length === 0) return null
        return (
          <div key={key}>
            <h3 className="mb-3 text-lg font-semibold text-gray-900">
              {icon} {title}
            </h3>
            <div className="space-y-2">
              {items.map((item: any, i: number) => (
                <div key={i} className="rounded-lg border border-gray-200 p-3">
                  <p className="font-medium text-gray-900">{item.title}</p>
                  {(item.link || item.platform) && (
                    <p className="mt-1 text-sm text-gray-500">
                      {item.link ? (
                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {item.link}
                        </a>
                      ) : (
                        item.platform
                      )}
                    </p>
                  )}
                  {(item.description || item.reason || item.snippet) && (
                    <p className="mt-1 text-sm text-gray-600">
                      {item.description || item.reason || item.snippet}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      })}
      {(!feed || sections.every(({ key }) => !feed[key]?.length)) && (
        <p className="text-sm text-gray-500">Content feed not available yet.</p>
      )}
    </div>
  )
}
