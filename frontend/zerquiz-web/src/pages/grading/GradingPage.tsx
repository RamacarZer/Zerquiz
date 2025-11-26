import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function GradingPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Grading</h1>
      <Card>
        <CardHeader>
          <CardTitle>Exam Results</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Grading system coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}

