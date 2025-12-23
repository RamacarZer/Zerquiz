import { useState, useEffect } from 'react';

export interface Lesson {
  id: string;
  title: string;
  subject: string;
  date: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

export interface Homework {
  id: string;
  title: string;
  dueDate: string;
  submittedCount: number;
  totalStudents: number;
  status: 'open' | 'closed';
}

const mockLessons: Lesson[] = [
  { id: '1', title: 'Matematik Ders 1', subject: 'Matematik', date: '2024-01-22', status: 'upcoming' },
  { id: '2', title: 'Fizik Ders 1', subject: 'Fizik', date: '2024-01-21', status: 'completed' },
];

const mockHomeworks: Homework[] = [
  { id: '1', title: 'Matematik Ödev 1', dueDate: '2024-01-25', submittedCount: 18, totalStudents: 25, status: 'open' },
  { id: '2', title: 'Fizik Ödev 1', dueDate: '2024-01-23', submittedCount: 22, totalStudents: 25, status: 'open' },
];

export function useClassroomData() {
  const [loading, setLoading] = useState(false);
  const [lessons, setLessons] = useState<Lesson[]>(mockLessons);
  const [homeworks, setHomeworks] = useState<Homework[]>(mockHomeworks);

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

  return { loading, lessons, homeworks, refreshData: fetchData };
}

