import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useParams } from 'react-router-dom';

export default function PresentationLivePage() {
  const { presentationId } = useParams();
  
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Live Presentation</h1>
      <Card>
        <CardHeader>
          <CardTitle>Presentation ID: {presentationId}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Live presentation mode coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}

