import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Code, FileCode, Sparkles, BookOpen, Play, Download, Share2,
} from 'lucide-react';
import CodeEditor from '../../components/editors/CodeEditor';

interface CodeTemplate {
  id: string;
  name: string;
  language: 'python' | 'javascript' | 'java' | 'cpp' | 'c' | 'typescript';
  code: string;
  description: string;
  testCases?: any[];
}

export default function CodeEditorDemoPage() {
  const navigate = useNavigate();

  const codeTemplates: CodeTemplate[] = [
    {
      id: 'python-hello',
      name: 'Python - Merhaba Dünya',
      language: 'python',
      code: `# Merhaba Dünya
print("Merhaba Dünya!")
print("Python programlama dili")`,
      description: 'Basit bir Python programı',
    },
    {
      id: 'python-sum',
      name: 'Python - Sayı Toplama',
      language: 'python',
      code: `def sum(a, b):
    """İki sayıyı toplar"""
    return a + b

# Test
result = sum(5, 3)
print(f"Toplam: {result}")`,
      description: 'İki sayıyı toplayan fonksiyon',
      testCases: [
        { id: 't1', input: '5, 3', expectedOutput: '8', description: 'Pozitif sayılar' },
        { id: 't2', input: '-2, 7', expectedOutput: '5', description: 'Negatif sayı' },
        { id: 't3', input: '0, 0', expectedOutput: '0', description: 'Sıfırlar' },
      ],
    },
    {
      id: 'python-factorial',
      name: 'Python - Faktöriyel',
      language: 'python',
      code: `def factorial(n):
    """Bir sayının faktöriyelini hesaplar"""
    if n == 0 or n == 1:
        return 1
    return n * factorial(n - 1)

# Test
number = 5
result = factorial(number)
print(f"{number}! = {result}")`,
      description: 'Faktöriyel hesaplama (recursive)',
      testCases: [
        { id: 't1', input: '5', expectedOutput: '120', description: '5 faktöriyel' },
        { id: 't2', input: '0', expectedOutput: '1', description: '0 faktöriyel' },
        { id: 't3', input: '3', expectedOutput: '6', description: '3 faktöriyel' },
      ],
    },
    {
      id: 'js-hello',
      name: 'JavaScript - Merhaba',
      language: 'javascript',
      code: `// JavaScript örneği
console.log("Merhaba JavaScript!");
console.log("Modern web programlama");

const name = "Öğrenci";
console.log("Hoşgeldin " + name);`,
      description: 'JavaScript temel çıktı',
    },
    {
      id: 'js-array',
      name: 'JavaScript - Array İşlemleri',
      language: 'javascript',
      code: `// Dizi işlemleri
const numbers = [1, 2, 3, 4, 5];

// Map ile her elemanı 2 ile çarp
const doubled = numbers.map(n => n * 2);
console.log("Doubled:", doubled);

// Filter ile çift sayıları al
const evens = numbers.filter(n => n % 2 === 0);
console.log("Evens:", evens);

// Reduce ile topla
const sum = numbers.reduce((a, b) => a + b, 0);
console.log("Sum:", sum);`,
      description: 'Array metodları örneği',
    },
    {
      id: 'java-hello',
      name: 'Java - Hello World',
      language: 'java',
      code: `public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        System.out.println("Java programlama dili");
    }
}`,
      description: 'Java Hello World örneği',
    },
    {
      id: 'cpp-sum',
      name: 'C++ - Toplama',
      language: 'cpp',
      code: `#include <iostream>
using namespace std;

int sum(int a, int b) {
    return a + b;
}

int main() {
    int result = sum(5, 3);
    cout << "Toplam: " << result << endl;
    return 0;
}`,
      description: 'C++ fonksiyon örneği',
    },
  ];

  const [selectedTemplate, setSelectedTemplate] = useState<CodeTemplate>(codeTemplates[0]);
  const [currentCode, setCurrentCode] = useState(selectedTemplate.code);

  const handleTemplateSelect = (template: CodeTemplate) => {
    setSelectedTemplate(template);
    setCurrentCode(template.code);
  };

  const statCards = [
    { label: 'Desteklenen Dil', value: '6', icon: Code, color: 'bg-blue-500' },
    { label: 'Hazır Şablon', value: codeTemplates.length, icon: FileCode, color: 'bg-green-500' },
    { label: 'Test Cases', value: codeTemplates.filter(t => t.testCases).length, icon: Play, color: 'bg-purple-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Code className="h-7 w-7 text-indigo-600" />
                  Code Editor
                </h1>
                <p className="text-sm text-gray-600">Programlama soruları için kod editörü</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                <Share2 className="h-4 w-4" /> Paylaş
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                <Download className="h-4 w-4" /> Dışa Aktar
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            {statCards.map((card, index) => (
              <div key={index} className={`${card.color} text-white p-4 rounded-lg shadow-md flex items-center justify-between`}>
                <div>
                  <div className="text-sm font-medium opacity-80">{card.label}</div>
                  <div className="text-2xl font-bold">{card.value}</div>
                </div>
                <card.icon className="h-8 w-8 opacity-50" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Templates */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                Kod Şablonları
              </h2>
              <div className="space-y-2">
                {codeTemplates.map(template => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    className={`w-full text-left p-3 rounded-lg transition ${
                      selectedTemplate.id === template.id
                        ? 'bg-indigo-50 border-2 border-indigo-500'
                        : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <FileCode className="h-4 w-4 text-gray-600" />
                      <span className="font-semibold text-sm text-gray-900">{template.name}</span>
                    </div>
                    <p className="text-xs text-gray-600">{template.description}</p>
                    {template.testCases && (
                      <div className="mt-2">
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded-full">
                          {template.testCases.length} Test
                        </span>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Info Card */}
              <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Kullanım İpuçları
                </h3>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• Şablonlardan birini seçin</li>
                  <li>• Kodu düzenleyin</li>
                  <li>• "Çalıştır" ile test edin</li>
                  <li>• Test cases varsa otomatik kontrol edilir</li>
                </ul>
              </div>
            </div>

            {/* Language Info */}
            <div className="bg-white rounded-lg shadow-md p-4 mt-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Desteklenen Diller</h2>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                  <span className="font-medium">Python</span>
                  <span className="text-xs text-gray-600">v3.x</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                  <span className="font-medium">JavaScript</span>
                  <span className="text-xs text-gray-600">ES6+</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                  <span className="font-medium">Java</span>
                  <span className="text-xs text-gray-600">v11+</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
                  <span className="font-medium">C++</span>
                  <span className="text-xs text-gray-600">C++17</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                  <span className="font-medium">TypeScript</span>
                  <span className="text-xs text-gray-600">v4.x</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="font-medium">C</span>
                  <span className="text-xs text-gray-600">C11</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Editor */}
          <div className="lg:col-span-3 space-y-6">
            {/* Selected Template Info */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-2">{selectedTemplate.name}</h2>
              <p className="opacity-90 mb-4">{selectedTemplate.description}</p>
              <div className="flex gap-4 text-sm">
                <span className="px-3 py-1 bg-white/20 rounded-full">Dil: {selectedTemplate.language.toUpperCase()}</span>
                {selectedTemplate.testCases && (
                  <span className="px-3 py-1 bg-white/20 rounded-full">
                    Test Cases: {selectedTemplate.testCases.length}
                  </span>
                )}
              </div>
            </div>

            {/* Code Editor */}
            <CodeEditor
              initialCode={currentCode}
              language={selectedTemplate.language}
              theme="vs-dark"
              height="500px"
              showLineNumbers={true}
              showMinimap={false}
              fontSize={14}
              onCodeChange={(code) => setCurrentCode(code)}
              testCases={selectedTemplate.testCases}
            />

            {/* Info Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Production Notları</h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <div>
                    <strong>Monaco Editor Entegrasyonu:</strong> Production'da Microsoft'un Monaco Editor kütüphanesi kullanılmalı
                    (VS Code'un editörü)
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 font-bold">2</span>
                  </div>
                  <div>
                    <strong>Backend Compiler:</strong> Kod çalıştırma için Docker container'da izole ortam (Judge0, Piston API)
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 font-bold">3</span>
                  </div>
                  <div>
                    <strong>Test Cases:</strong> Automated testing için backend'de test case execution engine
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-yellow-600 font-bold">4</span>
                  </div>
                  <div>
                    <strong>Security:</strong> Sandbox environment, resource limits, timeout controls
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

