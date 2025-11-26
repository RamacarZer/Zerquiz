import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';
import { api } from '@/lib/api';

interface SubscriptionPlan {
  id: string;
  code: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  currency: string;
  maxUsers: number;
  maxQuestions: number;
  maxExams: number;
  features: Record<string, boolean>;
}

interface UserSubscription {
  id: string;
  planId: string;
  planName: string;
  status: string;
  startDate: string;
  endDate: string;
  monthlyFee: number;
  currency: string;
  autoRenew: boolean;
}

export default function SubscriptionsPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    loadPlans();
    loadCurrentSubscription();
  }, []);

  const loadPlans = async () => {
    try {
      const response = await api.get('/finance/subscription-plans');
      setPlans(response.data);
    } catch (error) {
      console.error('Failed to load plans:', error);
      // Fallback demo data
      setPlans([
        {
          id: '1',
          code: 'starter',
          name: 'Starter',
          description: 'Perfect for individuals and small teams',
          monthlyPrice: 29,
          yearlyPrice: 290,
          currency: 'USD',
          maxUsers: 5,
          maxQuestions: 1000,
          maxExams: 50,
          features: {
            'Basic Question Types': true,
            'Exam Creation': true,
            'Auto Grading': true,
            'Email Support': true,
            'Custom Branding': false,
            'API Access': false,
            'Priority Support': false
          }
        },
        {
          id: '2',
          code: 'professional',
          name: 'Professional',
          description: 'For growing teams and institutions',
          monthlyPrice: 99,
          yearlyPrice: 990,
          currency: 'USD',
          maxUsers: 25,
          maxQuestions: 10000,
          maxExams: 500,
          features: {
            'Basic Question Types': true,
            'Exam Creation': true,
            'Auto Grading': true,
            'Email Support': true,
            'Custom Branding': true,
            'API Access': true,
            'Priority Support': false
          }
        },
        {
          id: '3',
          code: 'enterprise',
          name: 'Enterprise',
          description: 'For large organizations with advanced needs',
          monthlyPrice: 299,
          yearlyPrice: 2990,
          currency: 'USD',
          maxUsers: -1,
          maxQuestions: -1,
          maxExams: -1,
          features: {
            'Basic Question Types': true,
            'Exam Creation': true,
            'Auto Grading': true,
            'Email Support': true,
            'Custom Branding': true,
            'API Access': true,
            'Priority Support': true
          }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadCurrentSubscription = async () => {
    try {
      const response = await api.get('/finance/subscriptions');
      if (response.data.length > 0) {
        setCurrentSubscription(response.data[0]);
      }
    } catch (error) {
      console.error('Failed to load current subscription:', error);
    }
  };

  const subscribe = async (planId: string) => {
    try {
      await api.post('/finance/subscriptions', {
        planId,
        billingCycle
      });
      alert('Subscription created successfully!');
      loadCurrentSubscription();
    } catch (error) {
      console.error('Failed to subscribe:', error);
      alert('Failed to create subscription');
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
      <div>
        <h1 className="text-3xl font-bold">Subscription Plans</h1>
        <p className="text-muted-foreground">Choose the perfect plan for your needs</p>
      </div>

      {/* Current Subscription */}
      {currentSubscription && (
        <Card className="border-blue-500 bg-blue-50 dark:bg-blue-950">
          <CardHeader>
            <CardTitle>Current Subscription</CardTitle>
            <CardDescription>
              {currentSubscription.planName} - {currentSubscription.status}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Price</p>
                <p className="text-lg font-bold">${currentSubscription.monthlyFee}/{currentSubscription.currency}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Start Date</p>
                <p className="text-lg font-medium">{new Date(currentSubscription.startDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">End Date</p>
                <p className="text-lg font-medium">{new Date(currentSubscription.endDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Auto Renew</p>
                <Badge variant={currentSubscription.autoRenew ? 'default' : 'secondary'}>
                  {currentSubscription.autoRenew ? 'Yes' : 'No'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Billing Cycle Toggle */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-lg border p-1">
          <Button
            variant={billingCycle === 'monthly' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setBillingCycle('monthly')}
          >
            Monthly
          </Button>
          <Button
            variant={billingCycle === 'yearly' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setBillingCycle('yearly')}
          >
            Yearly (Save 17%)
          </Button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className={plan.code === 'professional' ? 'border-blue-500 shadow-lg' : ''}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </div>
                {plan.code === 'professional' && (
                  <Badge>Popular</Badge>
                )}
              </div>
              <div className="mt-4">
                <span className="text-4xl font-bold">
                  ${billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                </span>
                <span className="text-muted-foreground">
                  /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Limits:</p>
                <ul className="text-sm space-y-1">
                  <li>Users: {plan.maxUsers === -1 ? 'Unlimited' : plan.maxUsers}</li>
                  <li>Questions: {plan.maxQuestions === -1 ? 'Unlimited' : plan.maxQuestions.toLocaleString()}</li>
                  <li>Exams: {plan.maxExams === -1 ? 'Unlimited' : plan.maxExams}</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Features:</p>
                <ul className="space-y-2">
                  {Object.entries(plan.features).map(([feature, included]) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      {included ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-gray-300" />
                      )}
                      <span className={!included ? 'text-muted-foreground' : ''}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button 
                className="w-full" 
                onClick={() => subscribe(plan.id)}
                disabled={currentSubscription?.planId === plan.id}
              >
                {currentSubscription?.planId === plan.id ? 'Current Plan' : 'Subscribe'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

