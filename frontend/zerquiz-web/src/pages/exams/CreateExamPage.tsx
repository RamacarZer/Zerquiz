import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CreateExamPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Create Exam</h1>
      <Card>
        <CardHeader>
          <CardTitle>New Exam</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Exam creation wizard coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}

