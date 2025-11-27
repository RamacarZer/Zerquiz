import React from 'react';
import { Clock, Target, Shuffle, Eye, Check, BookOpen } from 'lucide-react';

interface ExamSettingsProps {
  settings: {
    duration: number;
    passingScore: number;
    shuffleQuestions: boolean;
    shuffleOptions: boolean;
    showResults: boolean;
    showCorrectAnswers: boolean;
    allowReview: boolean;
    bookletCount: number;
  };
  onSettingsChange: (settings: any) => void;
}

export default function ExamSettings({ settings, onSettingsChange }: ExamSettingsProps) {
  const handleChange = (key: string, value: any) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <div className="space-y-6">
      {/* Süre ve Puan Ayarları */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-600" />
          Süre ve Puan Ayarları
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sınav Süresi (dakika)
            </label>
            <input
              type="number"
              value={settings.duration}
              onChange={(e) => handleChange('duration', Number(e.target.value))}
              min="5"
              max="300"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">Önerilen: {settings.duration} dakika</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Geçme Puanı (%)
            </label>
            <input
              type="number"
              value={settings.passingScore}
              onChange={(e) => handleChange('passingScore', Number(e.target.value))}
              min="0"
              max="100"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">Minimum: %{settings.passingScore}</p>
          </div>
        </div>
      </div>

      {/* Karıştırma Ayarları */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Shuffle className="h-5 w-5 text-purple-600" />
          Karıştırma Ayarları
        </h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.shuffleQuestions}
              onChange={(e) => handleChange('shuffleQuestions', e.target.checked)}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">Soruları Karıştır</div>
              <div className="text-xs text-gray-500">Her öğrenci için sorular farklı sırada gelir</div>
            </div>
          </label>
          <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.shuffleOptions}
              onChange={(e) => handleChange('shuffleOptions', e.target.checked)}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">Şıkları Karıştır</div>
              <div className="text-xs text-gray-500">Her soruda şıklar farklı sırada gösterilir</div>
            </div>
          </label>
        </div>
      </div>

      {/* Sonuç Ayarları */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Eye className="h-5 w-5 text-emerald-600" />
          Sonuç Ayarları
        </h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.showResults}
              onChange={(e) => handleChange('showResults', e.target.checked)}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">Sonuçları Göster</div>
              <div className="text-xs text-gray-500">Sınav bitiminde puanı göster</div>
            </div>
          </label>
          <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.showCorrectAnswers}
              onChange={(e) => handleChange('showCorrectAnswers', e.target.checked)}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">Doğru Cevapları Göster</div>
              <div className="text-xs text-gray-500">Sonuçta doğru cevapları göster</div>
            </div>
          </label>
          <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.allowReview}
              onChange={(e) => handleChange('allowReview', e.target.checked)}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">İncelemeye İzin Ver</div>
              <div className="text-xs text-gray-500">Öğrenci sınavı sonradan inceleyebilir</div>
            </div>
          </label>
        </div>
      </div>

      {/* Kitapçık Ayarları */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-orange-600" />
          Kitapçık Ayarları
        </h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kitapçık Sayısı
          </label>
          <select
            value={settings.bookletCount}
            onChange={(e) => handleChange('bookletCount', Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value={1}>1 Kitapçık (A)</option>
            <option value={2}>2 Kitapçık (A, B)</option>
            <option value={4}>4 Kitapçık (A, B, C, D)</option>
          </select>
          <p className="mt-2 text-xs text-gray-500">
            {settings.bookletCount > 1
              ? `${settings.bookletCount} farklı kitapçık oluşturulacak (sorular karıştırılacak)`
              : 'Tek kitapçık oluşturulacak'}
          </p>
        </div>
      </div>

      {/* Özet */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">📋 Sınav Özeti</h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Süre:</span>
            <span className="font-medium text-gray-900">{settings.duration} dakika</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Geçme:</span>
            <span className="font-medium text-gray-900">%{settings.passingScore}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Soru Karıştır:</span>
            <span className="font-medium text-gray-900">{settings.shuffleQuestions ? '✓ Evet' : '✗ Hayır'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Şık Karıştır:</span>
            <span className="font-medium text-gray-900">{settings.shuffleOptions ? '✓ Evet' : '✗ Hayır'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Sonuç Göster:</span>
            <span className="font-medium text-gray-900">{settings.showResults ? '✓ Evet' : '✗ Hayır'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Kitapçık:</span>
            <span className="font-medium text-gray-900">{settings.bookletCount} adet</span>
          </div>
        </div>
      </div>
    </div>
  );
}

