/**
 * Whiteboard Page Wrapper
 * Route integration için wrapper component
 */

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ZercodeWhiteboardShell } from '../../whiteboard/shell/ZercodeWhiteboardShell';
import { FileText, BookOpen, File } from 'lucide-react';

export default function WhiteboardPage() {
  const { documentId } = useParams<{ documentId?: string }>();
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
  const [showPdfSelector, setShowPdfSelector] = useState(false);

  // Demo PDF seçenekleri
  const demoPdfs = [
    {
      id: 'demo',
      name: 'TracMonkey: JavaScript Compiler (14 sayfa)',
      description: 'Mozilla\'nın JavaScript trace-based JIT compiler makalesi',
      icon: FileText,
      pages: 14,
    },
    {
      id: 'sample',
      name: 'Hello World PDF (1 sayfa)',
      description: 'Basit test PDF\'i',
      icon: File,
      pages: 1,
    },
    {
      id: 'guide',
      name: 'Dummy PDF (1 sayfa)',
      description: 'W3C test PDF\'i',
      icon: BookOpen,
      pages: 1,
    },
  ];

  // PDF seçildiğinde
  const handlePdfSelect = (pdfId: string) => {
    setSelectedPdf(pdfId);
    setShowPdfSelector(false);
  };

  // Eğer PDF selector gösteriliyorsa
  if (showPdfSelector) {
    return (
      <div className="h-screen w-full bg-gray-50 flex items-center justify-center p-8">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Demo PDF Seçin
            </h1>
            <p className="text-gray-600">
              Annotation eklemek için bir PDF seçin
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {demoPdfs.map((pdf) => {
              const Icon = pdf.icon;
              return (
                <button
                  key={pdf.id}
                  onClick={() => handlePdfSelect(pdf.id)}
                  className="bg-white p-6 rounded-lg shadow-sm border-2 border-gray-200 hover:border-blue-500 hover:shadow-md transition text-left"
                >
                  <Icon className="w-12 h-12 text-blue-600 mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {pdf.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {pdf.description}
                  </p>
                  <div className="text-xs text-gray-500">
                    {pdf.pages} sayfa
                  </div>
                </button>
              );
            })}
          </div>

          <div className="text-center mt-6">
            <button
              onClick={() => setShowPdfSelector(false)}
              className="text-gray-600 hover:text-gray-900"
            >
              İptal (Whiteboard moduna dön)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full">
      <ZercodeWhiteboardShell 
        documentId={selectedPdf || documentId} 
        initialMode={selectedPdf ? 'pdf' : 'board'} 
      />
      
      {/* PDF Selector Button - Sabit konumda */}
      {!selectedPdf && (
        <button
          onClick={() => setShowPdfSelector(true)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition flex items-center gap-2 z-50"
        >
          <FileText className="w-5 h-5" />
          Demo PDF Yükle
        </button>
      )}
    </div>
  );
}





