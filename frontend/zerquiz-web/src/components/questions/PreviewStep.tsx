import React, { useState } from 'react';
import { Eye, CheckCircle } from 'lucide-react';
import EnhancedWhiteboard from '../common/EnhancedWhiteboard';
import Alert from '../common/Alert';

interface PreviewStepProps {
  headerText: string;
  questionText: string;
  options: Array<{ key: string; text: string; isCorrect: boolean; feedback: string }>;
  explanation: string;
  selectedOutputs: string[];
  selectedDeliveryModes: string[];
  tldrawSnapshot: any;
  setTldrawSnapshot: (snapshot: any) => void;
  videoBlob: Blob | null;
  setVideoBlob: (blob: Blob | null) => void;
  videoUrl: string | null;
  setVideoUrl: (url: string | null) => void;
}

const OUTPUT_CHANNELS = [
  { id: 'book', label: 'Kitap' },
  { id: 'mock_exam', label: 'Deneme' },
  { id: 'question_bank', label: 'Soru Bankası' },
  { id: 'presentation', label: 'Sunum' },
  { id: 'exam', label: 'Sınav' },
];

const DELIVERY_MODES = [
  { id: 'online', label: 'Online' },
  { id: 'offline', label: 'Offline' },
  { id: 'hybrid', label: 'Hibrit' },
];

export default function PreviewStep({
  headerText,
  questionText,
  options,
  explanation,
  selectedOutputs,
  selectedDeliveryModes,
  tldrawSnapshot,
  setTldrawSnapshot,
  videoBlob,
  setVideoBlob,
  videoUrl,
  setVideoUrl,
}: PreviewStepProps) {
  const [previewMode, setPreviewMode] = useState<'content' | 'whiteboard'>('content');

  const getOutputLabel = (value: string) =>
    OUTPUT_CHANNELS.find((channel) => channel.id === value)?.label || value;

  const getDeliveryLabel = (value: string) =>
    DELIVERY_MODES.find((mode) => mode.id === value)?.label || value;

  return (
    <div className="space-y-4">
      {/* Preview Mode Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setPreviewMode('content')}
          className={`px-4 py-2 text-sm font-medium transition border-b-2 ${
            previewMode === 'content'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <Eye className="inline h-4 w-4 mr-1.5" />
          Soru Ön İzleme
        </button>
        <button
          onClick={() => setPreviewMode('whiteboard')}
          className={`px-4 py-2 text-sm font-medium transition border-b-2 ${
            previewMode === 'whiteboard'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          🎨 Beyaz Tahta + Video Kayıt
        </button>
      </div>

      {/* Preview Content */}
      {previewMode === 'content' && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          {headerText && (
            <div className="mb-3 p-2 bg-blue-50 border-l-4 border-blue-500 rounded text-sm text-blue-900">
              {headerText}
            </div>
          )}

          <div className="mb-4">
            <div 
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: questionText || '<p class="text-gray-400">Soru metni girilmedi</p>' }}
            />
          </div>

          {options.length > 0 && (
            <div className="space-y-2">
              {options.map((option, index) => (
                <div
                  key={index}
                  className={`p-3 border-2 rounded-lg transition ${
                    option.isCorrect
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-gray-700">{option.key}.</span>
                    <span className={`text-sm ${option.isCorrect ? 'font-medium text-green-900' : ''}`}>
                      {option.text || 'Şık metni girilmedi'}
                    </span>
                    {option.isCorrect && <CheckCircle className="h-4 w-4 text-green-600 ml-auto" />}
                  </div>
                  {option.feedback && (
                    <div className="mt-1 ml-6 text-xs text-gray-600">💡 {option.feedback}</div>
                  )}
                </div>
              ))}
            </div>
          )}

          {explanation && (
            <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="text-xs font-medium text-purple-900 mb-1">Açıklama / Çözüm:</div>
              <div className="text-sm text-purple-800">{explanation}</div>
            </div>
          )}

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600">
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-1">Çıktı Türleri</p>
              <p>{selectedOutputs.map((id) => getOutputLabel(id)).join(', ')}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-1">Teslim Şekli</p>
              <p>{selectedDeliveryModes.map((id) => getDeliveryLabel(id)).join(', ')}</p>
            </div>
          </div>
        </div>
      )}

      {previewMode === 'whiteboard' && (
        <div>
          <Alert
            type="info"
            message="Soru içeriği arka planda gösterilir. Üzerine çizim yaparak çözüm oluşturun. İstenirse video kaydı alınabilir."
          />
          <div className="mt-3">
            <EnhancedWhiteboard
              questionContent={
                questionText 
                  ? `${headerText ? `<div class="mb-2 text-sm text-blue-600 font-medium">${headerText}</div>` : ''}${questionText}${
                      options.length > 0 
                        ? `<div class="mt-3 space-y-2">${options.map(opt => 
                            `<div class="text-sm"><strong>${opt.key}.</strong> ${opt.text}</div>`
                          ).join('')}</div>`
                        : ''
                    }` 
                  : undefined
              }
              onSave={(snapshot, videoBlob) => {
                setTldrawSnapshot(snapshot);
                if (videoBlob) {
                  setVideoBlob(videoBlob);
                  setVideoUrl(URL.createObjectURL(videoBlob));
                }
              }}
              initialData={tldrawSnapshot}
              height={550}
              showToolbar={true}
              enableVideo={true}
            />
            <div className="mt-2 text-xs text-gray-600">
              💡 <strong>9 Pozisyon:</strong> "Konum" butonuyla soruyu taşıyın | 
              <strong> Video:</strong> "Kayıt Başlat" ile çizimlerinizi kaydedin
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

