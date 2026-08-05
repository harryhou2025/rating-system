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

export interface QuestionMeta {
  ageGroup: string;                 // 月龄组：'2月龄' | '4月龄' | ... | '8岁'
  kind: 'milestone' | 'redflag';    // 里程碑题 / 警示标志题
}

export interface CdmmChildInfo {
  name: string;
  gender: '男' | '女';
  birthDate: string;                // YYYY-MM-DD
  isPremature: boolean;
  dueDate?: string;                 // 早产时必填，YYYY-MM-DD（预产期）
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
  totalScore: number;
  severity?: string;
  riskLevel?: string;
  recommendation: string;
  details?: Record<string, any>;
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
