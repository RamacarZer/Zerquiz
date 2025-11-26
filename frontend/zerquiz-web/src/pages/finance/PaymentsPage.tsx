import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PaymentsPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Payments</h1>
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Payment management coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}

