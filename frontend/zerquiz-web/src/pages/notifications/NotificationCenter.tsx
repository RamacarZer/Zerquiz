import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell, Mail, MessageSquare, Smartphone } from 'lucide-react';
import { api } from '@/lib/api';

interface NotificationPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  examStarted: boolean;
  examCompleted: boolean;
  gradePublished: boolean;
  questionApproved: boolean;
  paymentReceived: boolean;
  payoutProcessed: boolean;
}

interface NotificationHistory {
  id: string;
  type: string;
  title: string;
  message: string;
  sentAt: string;
  read: boolean;
}

export default function NotificationCenter() {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    examStarted: true,
    examCompleted: true,
    gradePublished: true,
    questionApproved: true,
    paymentReceived: true,
    payoutProcessed: true
  });
  const [history, setHistory] = useState<NotificationHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPreferences();
    loadHistory();
  }, []);

  const loadPreferences = async () => {
    try {
      // In production, load from API
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Failed to load preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    try {
      // Demo data
      setHistory([
        {
          id: '1',
          type: 'exam_completed',
          title: 'Exam Completed',
          message: 'Your Mathematics Final Exam has been completed',
          sentAt: new Date().toISOString(),
          read: false
        },
        {
          id: '2',
          type: 'grade_published',
          title: 'Grade Published',
          message: 'Your grade for Physics Midterm is now available',
          sentAt: new Date(Date.now() - 3600000).toISOString(),
          read: true
        }
      ]);
    } catch (error) {
      console.error('Failed to load notification history:', error);
    }
  };

  const savePreferences = async () => {
    try {
      // In production, save to API
      await api.post('/notifications/preferences', preferences);
      alert('Preferences saved successfully!');
    } catch (error) {
      console.error('Failed to save preferences:', error);
      alert('Failed to save preferences');
    }
  };

  const updatePreference = (key: keyof NotificationPreferences, value: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const markAsRead = async (notificationId: string) => {
    setHistory(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
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
      <div>
        <h1 className="text-3xl font-bold">Notification Center</h1>
        <p className="text-muted-foreground">Manage your notification preferences</p>
      </div>

      {/* Notification Channels */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Channels</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications via email</p>
              </div>
            </div>
            <Switch
              checked={preferences.emailNotifications}
              onCheckedChange={(checked) => updatePreference('emailNotifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label>SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
              </div>
            </div>
            <Switch
              checked={preferences.smsNotifications}
              onCheckedChange={(checked) => updatePreference('smsNotifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive push notifications on your device</p>
              </div>
            </div>
            <Switch
              checked={preferences.pushNotifications}
              onCheckedChange={(checked) => updatePreference('pushNotifications', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Event Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Event Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <NotificationToggle
            label="Exam Started"
            description="Notify when an exam session starts"
            checked={preferences.examStarted}
            onChange={(checked) => updatePreference('examStarted', checked)}
          />
          <NotificationToggle
            label="Exam Completed"
            description="Notify when an exam is completed"
            checked={preferences.examCompleted}
            onChange={(checked) => updatePreference('examCompleted', checked)}
          />
          <NotificationToggle
            label="Grade Published"
            description="Notify when grades are published"
            checked={preferences.gradePublished}
            onChange={(checked) => updatePreference('gradePublished', checked)}
          />
          <NotificationToggle
            label="Question Approved"
            description="Notify when your question is approved"
            checked={preferences.questionApproved}
            onChange={(checked) => updatePreference('questionApproved', checked)}
          />
          <NotificationToggle
            label="Payment Received"
            description="Notify when a payment is received"
            checked={preferences.paymentReceived}
            onChange={(checked) => updatePreference('paymentReceived', checked)}
          />
          <NotificationToggle
            label="Payout Processed"
            description="Notify when a payout is processed"
            checked={preferences.payoutProcessed}
            onChange={(checked) => updatePreference('payoutProcessed', checked)}
          />
        </CardContent>
      </Card>

      <Button onClick={savePreferences}>Save Preferences</Button>

      {/* Notification History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {history.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start gap-3 p-4 rounded-lg border ${
                  notification.read ? 'bg-muted/50' : 'bg-blue-50 dark:bg-blue-950'
                }`}
                onClick={() => !notification.read && markAsRead(notification.id)}
              >
                <Bell className={`h-5 w-5 ${notification.read ? 'text-muted-foreground' : 'text-blue-600'}`} />
                <div className="flex-1">
                  <h4 className="font-medium">{notification.title}</h4>
                  <p className="text-sm text-muted-foreground">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(notification.sentAt).toLocaleString()}
                  </p>
                </div>
                {!notification.read && (
                  <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function NotificationToggle({ label, description, checked, onChange }: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <Label>{label}</Label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

