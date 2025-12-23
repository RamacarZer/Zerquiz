import { useState } from 'react';

export interface Question {
  id: string;
  text: string;
  type: string;
  subject: string;
  difficulty: string;
  createdAt: string;
  createdBy: string;
  status: 'draft' | 'active' | 'archived';
}

const mockQuestions: Question[] = [
  { id: '1', text: 'Geometrik şekillerin alanı nasıl hesaplanır?', type: 'Çoktan Seçmeli', subject: 'Matematik', difficulty: 'Orta', createdAt: '2024-01-15', createdBy: 'Ahmet Öğretmen', status: 'active' },
  { id: '2', text: 'Fiziksel değişim nedir?', type: 'Doğru/Yanlış', subject: 'Fen', difficulty: 'Kolay', createdAt: '2024-01-14', createdBy: 'Ayşe Öğretmen', status: 'active' },
];

export function useQuestionData() {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>(mockQuestions);

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

  return { loading, questions, refreshData: fetchData };
}

