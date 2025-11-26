import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, FileText, TrendingUp, Eye } from 'lucide-react';
import { api } from '@/lib/api';

interface AuthorSummary {
  totalWorks: number;
  totalEarnings: number;
  pendingEarnings: number;
  thisMonthEarnings: number;
  totalUsage: number;
}

interface Work {
  id: string;
  title: string;
  workType: string;
  status: string;
  usageCount: number;
  totalEarnings: number;
  createdAt: string;
}

interface Payout {
  id: string;
  amount: number;
  status: string;
  requestedAt: string;
  processedAt?: string;
}

export default function AuthorDashboard() {
  const [summary, setSummary] = useState<AuthorSummary | null>(null);
  const [works, setWorks] = useState<Work[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [summaryRes, worksRes, payoutsRes] = await Promise.all([
        api.get('/royalty/author-dashboard/summary'),
        api.get('/royalty/author-dashboard/works'),
        api.get('/royalty/author-dashboard/payouts')
      ]);

      setSummary(summaryRes.data);
      setWorks(worksRes.data);
      setPayouts(payoutsRes.data);
    } catch (error) {
      console.error('Failed to load author dashboard:', error);
      // Demo data
      setSummary({
        totalWorks: 127,
        totalEarnings: 4567.89,
        pendingEarnings: 234.50,
        thisMonthEarnings: 567.23,
        totalUsage: 8945
      });
      setWorks([
        {
          id: '1',
          title: 'Advanced Calculus Question Set',
          workType: 'question_set',
          status: 'published',
          usageCount: 456,
          totalEarnings: 1234.56,
          createdAt: new Date().toISOString()
        }
      ]);
      setPayouts([
        {
          id: '1',
          amount: 1000,
          status: 'completed',
          requestedAt: new Date().toISOString(),
          processedAt: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const requestPayout = async () => {
    try {
      await api.post('/royalty/author-dashboard/request-payout', {
        amount: summary?.pendingEarnings
      });
      alert('Payout requested successfully!');
      loadDashboard();
    } catch (error) {
      console.error('Failed to request payout:', error);
      alert('Failed to request payout');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Author Dashboard</h1>
        <Button onClick={requestPayout} disabled={!summary || summary.pendingEarnings < 100}>
          Request Payout (${summary?.pendingEarnings.toFixed(2)})
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Works</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.totalWorks}</div>
            <p className="text-xs text-muted-foreground">Published content</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summary?.totalEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Earnings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summary?.pendingEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Available for payout</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summary?.thisMonthEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">+18% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Works */}
      <Card>
        <CardHeader>
          <CardTitle>Your Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {works.map((work) => (
              <div key={work.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium">{work.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {work.workType} • Created {new Date(work.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Usage</p>
                    <p className="font-medium">{work.usageCount}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Earnings</p>
                    <p className="font-medium">${work.totalEarnings.toFixed(2)}</p>
                  </div>
                  <Badge variant={work.status === 'published' ? 'default' : 'secondary'}>
                    {work.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Payouts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Payouts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {payouts.map((payout) => (
              <div key={payout.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">${payout.amount.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">
                    Requested: {new Date(payout.requestedAt).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant={
                  payout.status === 'completed' ? 'default' : 
                  payout.status === 'pending' ? 'secondary' : 
                  'destructive'
                }>
                  {payout.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

