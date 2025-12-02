import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { Edit, Sparkles, Workflow } from 'lucide-react';

export default function QuestionCreationModeSelector() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const modes = [
    {
      id: 'manual',
      icon: Edit,
      title: t('manualCreation'),
      description: t('manualCreationDesc'),
      color: 'blue',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      hoverColor: 'hover:bg-blue-100',
      iconColor: 'text-blue-600',
      route: '/questions/create',
      features: [
        t('fullEditor'),
        t('richFormatting'),
        t('mediaUpload'),
        t('versionControl'),
        t('collaboration'),
      ],
      targetUsers: [t('teachers'), t('authors'), t('editors')],
    },
    {
      id: 'ai_assisted',
      icon: Sparkles,
      title: t('aiAssisted'),
      description: t('aiAssistedDesc'),
      color: 'purple',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      hoverColor: 'hover:bg-purple-100',
      iconColor: 'text-purple-600',
      route: '/questions/ai-generate',
      badge: 'AI',
      features: [
        t('aiGeneration'),
        t('autoQuestions'),
        t('smartSuggestions'),
        t('bulkCreation'),
        t('pdfExtraction'),
      ],
      targetUsers: [t('teachers'), t('contentManagers')],
    },
    {
      id: 'hybrid',
      icon: Workflow,
      title: t('hybrid'),
      description: t('hybridDesc'),
      color: 'green',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      hoverColor: 'hover:bg-green-100',
      iconColor: 'text-green-600',
      route: '/questions/hybrid',
      badge: t('recommended'),
      features: [
        t('aiDraft'),
        t('manualEdit'),
        t('iterativeImprovement'),
        t('bestOfBoth'),
      ],
      targetUsers: [t('powerUsers'), t('contentTeams')],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('chooseContentCreationMode')}
          </h1>
          <p className="text-lg text-gray-600">
            {t('selectHowYouWantToCreateQuestions')}
          </p>
        </div>

        {/* Mode Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {modes.map((mode) => {
            const IconComponent = mode.icon;
            return (
              <div
                key={mode.id}
                onClick={() => navigate(mode.route)}
                className={`relative ${mode.bgColor} border-2 ${mode.borderColor} rounded-xl p-6 cursor-pointer transition-all duration-200 ${mode.hoverColor} transform hover:scale-105 hover:shadow-xl`}
              >
                {/* Badge */}
                {mode.badge && (
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      mode.badge === 'AI' ? 'bg-purple-600 text-white' : 'bg-green-600 text-white'
                    }`}>
                      {mode.badge}
                    </span>
                  </div>
                )}

                {/* Icon */}
                <div className={`${mode.iconColor} mb-4`}>
                  <IconComponent size={48} strokeWidth={1.5} />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {mode.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-6">
                  {mode.description}
                </p>

                {/* Features */}
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    {t('features')}:
                  </p>
                  <ul className="space-y-1">
                    {mode.features.map((feature, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Target Users */}
                <div className="border-t pt-4">
                  <p className="text-xs text-gray-500">
                    {t('idealFor')}: {mode.targetUsers.join(', ')}
                  </p>
                </div>

                {/* CTA Button */}
                <button
                  className={`mt-4 w-full py-3 rounded-lg font-semibold transition-colors ${
                    mode.color === 'blue' ? 'bg-blue-600 hover:bg-blue-700 text-white' :
                    mode.color === 'purple' ? 'bg-purple-600 hover:bg-purple-700 text-white' :
                    'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {t('startCreating')}
                </button>
              </div>
            );
          })}
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {t('comparisonTable')}
          </h2>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3">{t('feature')}</th>
                <th className="text-center py-3">{t('manual')}</th>
                <th className="text-center py-3">{t('aiAssisted')}</th>
                <th className="text-center py-3">{t('hybrid')}</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b">
                <td className="py-3">{t('creationSpeed')}</td>
                <td className="text-center">⭐⭐</td>
                <td className="text-center">⭐⭐⭐⭐⭐</td>
                <td className="text-center">⭐⭐⭐⭐</td>
              </tr>
              <tr className="border-b">
                <td className="py-3">{t('qualityControl')}</td>
                <td className="text-center">⭐⭐⭐⭐⭐</td>
                <td className="text-center">⭐⭐⭐</td>
                <td className="text-center">⭐⭐⭐⭐⭐</td>
              </tr>
              <tr className="border-b">
                <td className="py-3">{t('learningCurve')}</td>
                <td className="text-center">{t('medium')}</td>
                <td className="text-center">{t('easy')}</td>
                <td className="text-center">{t('medium')}</td>
              </tr>
              <tr className="border-b">
                <td className="py-3">{t('bulkGeneration')}</td>
                <td className="text-center">❌</td>
                <td className="text-center">✅</td>
                <td className="text-center">✅</td>
              </tr>
              <tr>
                <td className="py-3">{t('customization')}</td>
                <td className="text-center">⭐⭐⭐⭐⭐</td>
                <td className="text-center">⭐⭐⭐</td>
                <td className="text-center">⭐⭐⭐⭐⭐</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

