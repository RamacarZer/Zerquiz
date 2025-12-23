import { useState, useEffect } from 'react';

export interface Presentation {
  id: string;
  title: string;
  slideCount: number;
  createdBy: string;
  createdAt: string;
  lastModified: string;
  status: 'draft' | 'published';
}

const mockPresentations: Presentation[] = [
  { id: '1', title: 'Matematik Geometri', slideCount: 24, createdBy: 'Ahmet Öğretmen', createdAt: '2024-01-10', lastModified: '2024-01-15', status: 'published' },
  { id: '2', title: 'Fizik Kuvvet ve Hareket', slideCount: 18, createdBy: 'Ayşe Öğretmen', createdAt: '2024-01-12', lastModified: '2024-01-14', status: 'draft' },
];

export function usePresentationData() {
  const [loading, setLoading] = useState(false);
  const [presentations, setPresentations] = useState<Presentation[]>(mockPresentations);

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

  return { loading, presentations, refreshData: fetchData };
}

