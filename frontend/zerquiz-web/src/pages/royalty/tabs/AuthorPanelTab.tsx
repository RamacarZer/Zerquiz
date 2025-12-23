import { Copyright, DollarSign } from 'lucide-react';
import { useRoyaltyData } from '../hooks/useRoyaltyData';

export default function AuthorPanelTab() {
  const { authors } = useRoyaltyData();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Copyright className="w-8 h-8 text-purple-600" />
        <h2 className="text-2xl font-bold">Yazar Paneli</h2>
      </div>

      <div className="space-y-4">
        {authors.map((author) => (
          <div key={author.authorId} className="border rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">{author.authorName}</h3>
                <p className="text-sm text-gray-600">Son Ödeme: {author.lastPaid}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                author.status === 'active' ? 'bg-green-100 text-green-800' :
                author.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {author.status === 'active' ? 'Aktif' :
                 author.status === 'pending' ? 'Beklemede' : 'Durduruldu'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Toplam Kazanç</p>
                <p className="text-2xl font-bold text-blue-600 flex items-center gap-1">
                  <DollarSign className="w-6 h-6" />
                  {author.totalEarnings.toLocaleString()} ₺
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Bu Ay</p>
                <p className="text-2xl font-bold text-green-600 flex items-center gap-1">
                  <DollarSign className="w-6 h-6" />
                  {author.thisMonth.toLocaleString()} ₺
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

