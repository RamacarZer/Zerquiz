import { useState, useEffect } from 'react';

export interface AuthorEarnings {
  authorId: string;
  authorName: string;
  totalEarnings: number;
  thisMonth: number;
  lastPaid: string;
  status: 'active' | 'pending' | 'paused';
}

export interface RoyaltyReport {
  id: string;
  period: string;
  totalRevenue: number;
  authorPayments: number;
  generatedAt: string;
}

const mockAuthors: AuthorEarnings[] = [
  { authorId: '1', authorName: 'Prof. Dr. Ahmet Yılmaz', totalEarnings: 45000, thisMonth: 3500, lastPaid: '2024-01-01', status: 'active' },
  { authorId: '2', authorName: 'Doç. Dr. Ayşe Demir', totalEarnings: 38000, thisMonth: 2800, lastPaid: '2024-01-01', status: 'active' },
];

const mockReports: RoyaltyReport[] = [
  { id: '1', period: '2024-01', totalRevenue: 125000, authorPayments: 35000, generatedAt: '2024-01-05' },
  { id: '2', period: '2023-12', totalRevenue: 118000, authorPayments: 32000, generatedAt: '2023-12-05' },
];

export function useRoyaltyData() {
  const [loading, setLoading] = useState(false);
  const [authors, setAuthors] = useState<AuthorEarnings[]>(mockAuthors);
  const [reports, setReports] = useState<RoyaltyReport[]>(mockReports);

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

  return { loading, authors, reports, refreshData: fetchData };
}

