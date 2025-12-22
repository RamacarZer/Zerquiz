import { api } from '@/lib/api';

// Types
export interface FinancialSummaryDto {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  completedPayments: number;
  pendingPayments: number;
  activeSubscriptions: number;
  avgRevenuePerUser: number;
  monthlyGrowth: number;
}

export interface CashAccountDto {
  id: string;
  name: string;
  balance: number;
  currency: string;
  type: 'main' | 'bank' | 'branch';
  lastUpdate: string;
}

export interface TransactionDto {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: string;
  reference?: string;
}

export interface CreateTransactionRequest {
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: string;
  reference?: string;
}

export interface BudgetDto {
  id: string;
  department: string;
  allocated: number;
  used: number;
  variance: number;
  period: string;
}

export interface CreateBudgetRequest {
  department: string;
  allocated: number;
  period: string;
}

export interface PerDiemRequestDto {
  id: string;
  employee: string;
  destination: string;
  purpose: string;
  amount: number;
  status: 'approved' | 'pending' | 'rejected';
  submittedAt: string;
}

export interface CreatePerDiemRequest {
  employee: string;
  destination: string;
  purpose: string;
  amount: number;
}

export interface InvoiceDto {
  id: string;
  invoiceNumber: string;
  tenantName: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  type: 'invoice' | 'proforma';
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
}

export interface CreateInvoiceRequest {
  tenantId: string;
  tenantName: string;
  type: 'invoice' | 'proforma';
  currency: string;
  dueDate: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
  }[];
}

export interface SubscriptionDto {
  id: string;
  planName: string;
  tenantName: string;
  amount: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly';
  status: 'active' | 'cancelled' | 'expired';
  startDate: string;
  nextBillingDate: string;
  autoRenew: boolean;
}

export interface PaymentGatewayDto {
  id: string;
  name: string;
  status: 'operational' | 'degraded' | 'down';
  successRate: string;
  uptime: string;
  issues: string[];
}

// API Endpoints
const ENDPOINTS = {
  FINANCIAL_SUMMARY: '/api/Finance/summary',
  CASH_ACCOUNTS: '/api/Finance/cash-accounts',
  TRANSACTIONS: '/api/Finance/transactions',
  BUDGETS: '/api/Finance/budgets',
  PERDIEM: '/api/Finance/per-diem',
  INVOICES: '/api/Finance/invoices',
  SUBSCRIPTIONS: '/api/Finance/subscriptions',
  PAYMENT_GATEWAYS: '/api/Finance/payment-gateways',
};

// Financial Summary
export const getFinancialSummary = async (): Promise<FinancialSummaryDto> => {
  const response = await api.get<FinancialSummaryDto>(ENDPOINTS.FINANCIAL_SUMMARY);
  return response.data;
};

// Cash Accounts
export const getCashAccounts = async (): Promise<CashAccountDto[]> => {
  const response = await api.get<CashAccountDto[]>(ENDPOINTS.CASH_ACCOUNTS);
  return response.data;
};

export const createCashAccount = async (data: Omit<CashAccountDto, 'id' | 'lastUpdate'>): Promise<CashAccountDto> => {
  const response = await api.post<CashAccountDto>(ENDPOINTS.CASH_ACCOUNTS, data);
  return response.data;
};

export const updateCashAccount = async (id: string, data: Partial<CashAccountDto>): Promise<CashAccountDto> => {
  const response = await api.put<CashAccountDto>(`${ENDPOINTS.CASH_ACCOUNTS}/${id}`, data);
  return response.data;
};

export const deleteCashAccount = async (id: string): Promise<void> => {
  await api.delete(`${ENDPOINTS.CASH_ACCOUNTS}/${id}`);
};

// Transactions
export const getTransactions = async (): Promise<TransactionDto[]> => {
  const response = await api.get<TransactionDto[]>(ENDPOINTS.TRANSACTIONS);
  return response.data;
};

export const createTransaction = async (data: CreateTransactionRequest): Promise<TransactionDto> => {
  const response = await api.post<TransactionDto>(ENDPOINTS.TRANSACTIONS, data);
  return response.data;
};

export const deleteTransaction = async (id: string): Promise<void> => {
  await api.delete(`${ENDPOINTS.TRANSACTIONS}/${id}`);
};

// Budgets
export const getBudgets = async (): Promise<BudgetDto[]> => {
  const response = await api.get<BudgetDto[]>(ENDPOINTS.BUDGETS);
  return response.data;
};

export const createBudget = async (data: CreateBudgetRequest): Promise<BudgetDto> => {
  const response = await api.post<BudgetDto>(ENDPOINTS.BUDGETS, data);
  return response.data;
};

export const updateBudget = async (id: string, data: Partial<BudgetDto>): Promise<BudgetDto> => {
  const response = await api.put<BudgetDto>(`${ENDPOINTS.BUDGETS}/${id}`, data);
  return response.data;
};

export const deleteBudget = async (id: string): Promise<void> => {
  await api.delete(`${ENDPOINTS.BUDGETS}/${id}`);
};

// Per Diem Requests
export const getPerDiemRequests = async (): Promise<PerDiemRequestDto[]> => {
  const response = await api.get<PerDiemRequestDto[]>(ENDPOINTS.PERDIEM);
  return response.data;
};

export const createPerDiemRequest = async (data: CreatePerDiemRequest): Promise<PerDiemRequestDto> => {
  const response = await api.post<PerDiemRequestDto>(ENDPOINTS.PERDIEM, data);
  return response.data;
};

export const approvePerDiemRequest = async (id: string): Promise<PerDiemRequestDto> => {
  const response = await api.post<PerDiemRequestDto>(`${ENDPOINTS.PERDIEM}/${id}/approve`);
  return response.data;
};

export const rejectPerDiemRequest = async (id: string): Promise<PerDiemRequestDto> => {
  const response = await api.post<PerDiemRequestDto>(`${ENDPOINTS.PERDIEM}/${id}/reject`);
  return response.data;
};

// Invoices
export const getInvoices = async (): Promise<InvoiceDto[]> => {
  const response = await api.get<InvoiceDto[]>(ENDPOINTS.INVOICES);
  return response.data;
};

export const createInvoice = async (data: CreateInvoiceRequest): Promise<InvoiceDto> => {
  const response = await api.post<InvoiceDto>(ENDPOINTS.INVOICES, data);
  return response.data;
};

export const updateInvoice = async (id: string, data: Partial<InvoiceDto>): Promise<InvoiceDto> => {
  const response = await api.put<InvoiceDto>(`${ENDPOINTS.INVOICES}/${id}`, data);
  return response.data;
};

export const deleteInvoice = async (id: string): Promise<void> => {
  await api.delete(`${ENDPOINTS.INVOICES}/${id}`);
};

export const downloadInvoicePdf = async (id: string): Promise<Blob> => {
  const response = await api.get(`${ENDPOINTS.INVOICES}/${id}/pdf`, {
    responseType: 'blob',
  });
  return response.data;
};

export const sendInvoiceEmail = async (id: string, email: string): Promise<void> => {
  await api.post(`${ENDPOINTS.INVOICES}/${id}/send`, { email });
};

// Subscriptions
export const getSubscriptions = async (): Promise<SubscriptionDto[]> => {
  const response = await api.get<SubscriptionDto[]>(ENDPOINTS.SUBSCRIPTIONS);
  return response.data;
};

export const updateSubscription = async (id: string, data: Partial<SubscriptionDto>): Promise<SubscriptionDto> => {
  const response = await api.put<SubscriptionDto>(`${ENDPOINTS.SUBSCRIPTIONS}/${id}`, data);
  return response.data;
};

export const cancelSubscription = async (id: string): Promise<void> => {
  await api.post(`${ENDPOINTS.SUBSCRIPTIONS}/${id}/cancel`);
};

// Payment Gateways
export const getPaymentGateways = async (): Promise<PaymentGatewayDto[]> => {
  const response = await api.get<PaymentGatewayDto[]>(ENDPOINTS.PAYMENT_GATEWAYS);
  return response.data;
};

export const updatePaymentGateway = async (id: string, data: Partial<PaymentGatewayDto>): Promise<PaymentGatewayDto> => {
  const response = await api.put<PaymentGatewayDto>(`${ENDPOINTS.PAYMENT_GATEWAYS}/${id}`, data);
  return response.data;
};

// Export Report
export const exportFinancialReport = async (format: 'pdf' | 'excel' = 'pdf'): Promise<Blob> => {
  const response = await api.get(`/api/Finance/report/export`, {
    params: { format },
    responseType: 'blob',
  });
  return response.data;
};

