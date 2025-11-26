import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function QuestionReviewQueue() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Question Review Queue</h1>
      <Card>
        <CardHeader>
          <CardTitle>Pending Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Question review workflow coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}

