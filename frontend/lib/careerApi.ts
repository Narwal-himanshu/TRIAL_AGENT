import { GenerateCareerRequest, GenerateCareerResponse } from "../types/career";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function generateCareerPlan(data: GenerateCareerRequest): Promise<GenerateCareerResponse> {
  const response = await fetch(`${API_URL}/api/career/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errorMessage = "Failed to generate career plan.";
    try {
      const errorData = await response.json();
      if (errorData.detail) {
        errorMessage = errorData.detail;
      }
    } catch {
      // Ignore json parse errors if response is not json
    }
    throw new Error(errorMessage);
  }

  return response.json();
}
