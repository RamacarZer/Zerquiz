import { useState, useEffect } from 'react';

export interface AnalyticsOverview {
  totalStudents: number;
  activeUsers: number;
  completedExams: number;
  avgScore: number;
}

export interface StudentPerformance {
  studentId: string;
  studentName: string;
  examCount: number;
  avgScore: number;
  lastActivity: string;
}

export interface ClassroomStats {
  totalStudents: number;
  averageScore: number;
  completionRate: number;
  activeNow: number;
}

export interface LearningStyleData {
  visual: number;
  auditory: number;
  kinesthetic: number;
  reading: number;
}

export interface StudentLearningProfile {
  studentId: string;
  studentName: string;
  dominantStyle: string;
  styleScores: LearningStyleData;
  recommendations: string[];
  performanceByStyle: {
    style: string;
    avgScore: number;
    completionRate: number;
  }[];
}

export interface AIAnalyticsData {
  studentPrediction: {
    studentId: string;
    studentName: string;
    currentAverage: number;
    predictedScore: number;
    confidence: number;
    trend: string;
    riskLevel: string;
    recommendations: any[];
    strengths: string[];
    weaknesses: string[];
  };
  performanceData: any[];
  topicProficiency: any[];
  questionQualityData: any[];
}

const mockOverview: AnalyticsOverview = {
  totalStudents: 1250,
  activeUsers: 890,
  completedExams: 3456,
  avgScore: 78.5,
};

const mockPerformance: StudentPerformance[] = [
  { studentId: '1', studentName: 'Ali Yılmaz', examCount: 12, avgScore: 85.5, lastActivity: '2024-01-20' },
  { studentId: '2', studentName: 'Ayşe Demir', examCount: 10, avgScore: 92.3, lastActivity: '2024-01-19' },
];

export function useAnalyticsData() {
  const [loading, setLoading] = useState(false);
  const [overview, setOverview] = useState<AnalyticsOverview>(mockOverview);
  const [performance, setPerformance] = useState<StudentPerformance[]>(mockPerformance);

  const fetchData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { loading, overview, performance, refreshData: fetchData };
}
