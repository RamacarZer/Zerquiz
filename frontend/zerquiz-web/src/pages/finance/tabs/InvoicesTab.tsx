import { useState, useMemo } from 'react';
import { FileText, Plus, Download, Send } from 'lucide-react';
import { useFinanceData } from '../hooks/useFinanceData';

export default function InvoicesTab() {
  const { invoices } = useFinanceData();
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'invoice' | 'proforma'>('all');

  const filteredInvoices = useMemo(() => {
    let result = invoices;
    if (statusFilter !== 'all') {
      result = result.filter(inv => inv.status === statusFilter);
    }
    if (typeFilter !== 'all') {
      result = result.filter(inv => inv.type === typeFilter);
    }
    return result;
  }, [invoices, statusFilter, typeFilter]);

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { label: string; color: string }> = {
      paid: { label: 'Ödendi', color: 'bg-green-100 text-green-800' },
      pending: { label: 'Beklemede', color: 'bg-yellow-100 text-yellow-800' },
      overdue: { label: 'Gecikmiş', color: 'bg-red-100 text-red-800' },
    };
    const config = configs[status] || configs.pending;
    return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}>{config.label}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <FileText className="w-8 h-8 text-blue-600" />
          Faturalar
        </h2>
        <div className="flex gap-3">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-900"
          >
            <option value="all">Tüm Tipler</option>
            <option value="invoice">Fatura</option>
            <option value="proforma">Proforma</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-900"
          >
            <option value="all">Tüm Durumlar</option>
            <option value="paid">Ödendi</option>
            <option value="pending">Bekliyor</option>
            <option value="overdue">Gecikmiş</option>
          </select>
          <button className="btn btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Yeni Fatura
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredInvoices.map((invoice) => (
          <div key={invoice.id} className="border rounded-xl p-6 bg-white dark:bg-gray-800">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold">{invoice.invoiceNumber}</h3>
                  {getStatusBadge(invoice.status)}
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    invoice.type === 'invoice' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                  }`}>
                    {invoice.type === 'invoice' ? 'Fatura' : 'Proforma'}
                  </span>
                </div>
                <p className="font-medium">{invoice.tenantName}</p>
                <div className="flex gap-4 text-sm text-gray-600 mt-2">
                  <span>Düzenleme: {new Date(invoice.issueDate).toLocaleDateString('tr-TR')}</span>
                  <span>Vade: {new Date(invoice.dueDate).toLocaleDateString('tr-TR')}</span>
                </div>
              </div>
              <p className="text-3xl font-bold">
                {invoice.amount.toFixed(2)} {invoice.currency}
              </p>
            </div>

            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <h4 className="font-medium mb-2">Kalemler:</h4>
              <div className="space-y-2">
                {invoice.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span>{item.description} (x{item.quantity})</span>
                    <span className="font-medium">{item.total.toFixed(2)} {invoice.currency}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button className="btn btn-primary flex items-center gap-2">
                <Download className="w-4 h-4" />
                PDF İndir
              </button>
              <button className="btn btn-secondary flex items-center gap-2">
                <Send className="w-4 h-4" />
                E-posta Gönder
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

