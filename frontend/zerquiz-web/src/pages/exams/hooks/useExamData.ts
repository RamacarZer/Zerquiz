import { useState, useEffect } from 'react';

export interface Exam {
  id: string;
  title: string;
  subject: string;
  duration: number;
  questionCount: number;
  status: 'draft' | 'published' | 'ongoing' | 'completed';
  createdAt: string;
  participants?: number;
}

const mockExams: Exam[] = [
  { id: '1', title: 'Matematik Midterm', subject: 'Matematik', duration: 90, questionCount: 30, status: 'published', createdAt: '2024-01-15', participants: 45 },
  { id: '2', title: 'Fizik Final', subject: 'Fizik', duration: 120, questionCount: 40, status: 'ongoing', createdAt: '2024-01-10', participants: 38 },
];

export function useExamData() {
  const [loading, setLoading] = useState(false);
  const [exams, setExams] = useState<Exam[]>(mockExams);

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

  return { loading, exams, refreshData: fetchData };
}

