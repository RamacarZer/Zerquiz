import { useState, useEffect } from 'react';

export interface ContentItem {
  id: string;
  title: string;
  type: 'video' | 'document' | 'image' | 'audio';
  size: number;
  uploadedBy: string;
  uploadedAt: string;
  tags: string[];
}

const mockContent: ContentItem[] = [
  { id: '1', title: 'Matematik Ders Notu.pdf', type: 'document', size: 2048576, uploadedBy: 'Ahmet Öğretmen', uploadedAt: '2024-01-15', tags: ['Matematik', '9. Sınıf'] },
  { id: '2', title: 'Fizik Deney Videosu.mp4', type: 'video', size: 15728640, uploadedBy: 'Ayşe Öğretmen', uploadedAt: '2024-01-14', tags: ['Fizik', 'Deney'] },
];

export function useContentData() {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<ContentItem[]>(mockContent);

  const fetchData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    loading,
    content,
    refreshData: fetchData,
  };
}

