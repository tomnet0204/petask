export type AnimalType = 'dog' | 'cat';

export type UrgencyLevel = 'emergency' | 'urgent' | 'watchful' | 'monitor';

export type ReviewStatus =
  | 'ai_generated'
  | 'pending_review'
  | 'supervisor_reviewed'
  | 'published';

export interface PetProfile {
  animalType: AnimalType;
  breed?: string;
  ageYears?: number;
  ageMonths?: number;
  sex?: 'male' | 'female' | 'unknown';
  weightKg?: number;
  isNeutered?: boolean;
  conditions?: string[];
  medications?: string[];
}

export interface SymptomInput {
  primarySymptom: string;
  onsetDays?: number;
  frequency?: string;
  appetite: 'normal' | 'reduced' | 'none';
  canDrinkWater: 'yes' | 'no' | 'reduced';
  energy: 'normal' | 'reduced' | 'very_low' | 'unconscious';
  urination: 'normal' | 'increased' | 'decreased' | 'none';
  defecation: 'normal' | 'diarrhea' | 'constipation' | 'none' | 'blood';
  breathing: 'normal' | 'labored' | 'very_difficult';
  possibleIngestion?: boolean;
  additionalNotes?: string;
}

export interface CheckerResult {
  urgencyLevel: UrgencyLevel;
  urgencyReasons: string[];
  watchPoints: string[];
  vetCommunicationGuide: string;
  bringToVet: string[];
  relatedArticleSlugs: string[];
  disclaimer: string;
  ruleBasedFlags: string[];
}

export interface SymptomFrontmatter {
  title: string;
  description: string;
  animal: AnimalType;
  symptomSlug: string;
  reviewStatus: ReviewStatus;
  supervisorName?: string;
  supervisorCredential?: string;
  lastReviewedAt?: string;
  publishedAt?: string;
  updatedAt?: string;
  emergencyLevel: 'high' | 'medium' | 'low';
  keywords: string[];
  references: { title: string; url: string; accessedAt: string }[];
  noindex?: boolean;
}

export interface SymptomData {
  frontmatter: SymptomFrontmatter;
  content: string;
  slug: string;
}

export interface SymptomMeta {
  slug: string;
  label: string;
  animal: AnimalType;
  emergencyLevel: 'high' | 'medium' | 'low';
  keywords: string[];
}
