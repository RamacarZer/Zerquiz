import { FileText, Download } from 'lucide-react';
import { useRoyaltyData } from '../hooks/useRoyaltyData';

export default function ReportsTab() {
  const { reports } = useRoyaltyData();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FileText className="w-8 h-8 text-blue-600" />
        <h2 className="text-2xl font-bold">Telif Raporları</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border rounded-xl">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">Dönem</th>
              <th className="px-6 py-3 text-left font-semibold">Toplam Gelir</th>
              <th className="px-6 py-3 text-left font-semibold">Yazar Ödemeleri</th>
              <th className="px-6 py-3 text-left font-semibold">Tarih</th>
              <th className="px-6 py-3 text-left font-semibold">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {reports.map((report) => (
              <tr key={report.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold">{report.period}</td>
                <td className="px-6 py-4 text-green-600 font-semibold">
                  {report.totalRevenue.toLocaleString()} ₺
                </td>
                <td className="px-6 py-4 text-blue-600 font-semibold">
                  {report.authorPayments.toLocaleString()} ₺
                </td>
                <td className="px-6 py-4 text-gray-600">{report.generatedAt}</td>
                <td className="px-6 py-4">
                  <button className="btn btn-sm btn-secondary flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    İndir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

