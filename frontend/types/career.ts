export interface UserProfile {
  name: string;
  current_role: string;
  target_role: string;
  years_experience: number;
  skills: string[];
  education?: string;
}

export interface YearlyPlan {
  year: number;
  title: string;
  goals: string[];
  actions: string[];
  skills_to_learn: string[];
  milestone: string;
}

export interface PlanMetadata {
  generated_at: string;
  model: string;
}

export interface GenerateCareerResponse {
  plan: YearlyPlan[];
  metadata: PlanMetadata;
}

export interface GenerateCareerRequest {
  user_profile: UserProfile;
  years: number;
}
