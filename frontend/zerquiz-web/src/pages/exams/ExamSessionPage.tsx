import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useParams } from 'react-router-dom';

export default function ExamSessionPage() {
  const { examId } = useParams();
  
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Exam Session</h1>
      <Card>
        <CardHeader>
          <CardTitle>Exam ID: {examId}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Exam session interface coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}

