export interface User {
  id: string;
  email: string;
  password?: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface Scale {
  id: string;
  title: string;
  description: string;
  category: ScaleCategory;
  targetAudience: string;
  estimatedTime: number;
  instructions: string;
  resultInterpretation: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ScaleCategory = 'psychological' | 'developmental' | 'emotional' | 'cognitive' | 'behavioral';

export interface Question {
  id: string;
  scaleId: string;
  content: string;
  type: 'choice' | 'rating' | 'text';
  options?: string[];
  order: number;
}

export interface Assessment {
  id: string;
  userId?: string;
  scaleId: string;
  status: 'draft' | 'completed' | 'abandoned';
  answers: Record<string, any>;
  result?: AssessmentResult;
  startedAt: Date;
  completedAt?: Date;
  ipAddress: string;
}

export interface AssessmentResult {
  score: number;
  interpretation: string;
  recommendations: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

export interface Statistics {
  totalUsers: number;
  totalAssessments: number;
  completedAssessments: number;
  abandonedAssessments: number;
  scaleStats: ScaleStats[];
  dailyTrends: DailyTrend[];
}

export interface ScaleStats {
  scaleId: string;
  scaleTitle: string;
  totalParticipants: number;
  completedCount: number;
  abandonedCount: number;
  completionRate: number;
}

export interface DailyTrend {
  date: string;
  assessments: number;
  completions: number;
}
