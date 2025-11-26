import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, TrendingUp, Users, BookOpen, DollarSign } from 'lucide-react';
import { api } from '@/lib/api';

interface DashboardStats {
  totalUsers: number;
  totalQuestions: number;
  totalExams: number;
  totalRevenue: number;
  activeSubscriptions: number;
  pendingReviews: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalQuestions: 0,
    totalExams: 0,
    totalRevenue: 0,
    activeSubscriptions: 0,
    pendingReviews: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      // In production, call actual API endpoints
      // Simulating data for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        totalUsers: 1245,
        totalQuestions: 8567,
        totalExams: 342,
        totalRevenue: 45789,
        activeSubscriptions: 89,
        pendingReviews: 23
      });
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async (reportType: string) => {
    try {
      const response = await api.post('/core/reports/generate', {
        reportType,
        parameters: {},
        outputFormat: 'pdf'
      });
      
      if (response.data.downloadUrl) {
        window.open(response.data.downloadUrl, '_blank');
      }
    } catch (error) {
      console.error('Failed to generate report:', error);
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
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => downloadReport('financial')}>
            <FileText className="mr-2 h-4 w-4" />
            Financial Report
          </Button>
          <Button variant="outline" onClick={() => downloadReport('audit_log')}>
            <FileText className="mr-2 h-4 w-4" />
            Audit Report
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalQuestions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+245 this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Exams</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalExams.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+18% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
            <p className="text-xs text-muted-foreground">+5 new this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingReviews}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col" onClick={() => window.location.href = '/questions/review-queue'}>
              <FileText className="h-6 w-6 mb-2" />
              Review Questions
            </Button>
            <Button variant="outline" className="h-20 flex flex-col" onClick={() => window.location.href = '/finance/subscriptions'}>
              <DollarSign className="h-6 w-6 mb-2" />
              Manage Subscriptions
            </Button>
            <Button variant="outline" className="h-20 flex flex-col" onClick={() => window.location.href = '/royalty/author-dashboard'}>
              <Users className="h-6 w-6 mb-2" />
              Author Payouts
            </Button>
            <Button variant="outline" className="h-20 flex flex-col" onClick={() => downloadReport('exam_results')}>
              <Download className="h-6 w-6 mb-2" />
              Export Reports
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ActivityItem 
              title="New subscription created" 
              description="Enterprise plan - Company ABC"
              time="5 minutes ago"
            />
            <ActivityItem 
              title="Question approved" 
              description="Mathematics - Question #Q-12345"
              time="12 minutes ago"
            />
            <ActivityItem 
              title="Exam completed" 
              description="Midterm Exam - 45 students"
              time="1 hour ago"
            />
            <ActivityItem 
              title="Payment received" 
              description="$299.00 - Monthly subscription"
              time="2 hours ago"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ActivityItem({ title, description, time }: { title: string; description: string; time: string }) {
  return (
    <div className="flex items-start gap-4 pb-4 border-b last:border-0">
      <div className="h-2 w-2 rounded-full bg-blue-500 mt-2"></div>
      <div className="flex-1">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <span className="text-xs text-muted-foreground">{time}</span>
    </div>
  );
}

