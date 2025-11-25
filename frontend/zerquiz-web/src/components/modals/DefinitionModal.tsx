import { useState, useEffect } from 'react';
import {
  createDefinition,
  updateDefinition,
  getDefinitions,
  getGroupColor,
  type DefinitionGroupDto,
  type DefinitionDto,
  type CreateDefinitionRequest,
  type UpdateDefinitionRequest,
  type TranslationDto
} from '../../services/api/definitionService';
import { getEducationModels, type EducationModelDto } from '../../services/api/curriculumService';

interface DefinitionModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit' | 'view';
  group: DefinitionGroupDto | null;
  definition?: DefinitionDto | null;
  parentId?: string;
  onClose: () => void;
  onSave: () => void;
}

export default function DefinitionModal({
  isOpen,
  mode,
  group,
  definition,
  parentId,
  onClose,
  onSave
}: DefinitionModalProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'translations'>('basic');
  const [loading, setLoading] = useState(false);
  const [parents, setParents] = useState<DefinitionDto[]>([]);
  const [educationModels, setEducationModels] = useState<EducationModelDto[]>([]);

  // Basic info
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('');
  const [icon, setIcon] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isDefault, setIsDefault] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [selectedParentId, setSelectedParentId] = useState<string>('');
  const [selectedEducationModelId, setSelectedEducationModelId] = useState<string>('');

  // Translations
  const [translations, setTranslations] = useState<TranslationDto[]>([
    { languageCode: 'en', name: '', description: '' },
    { languageCode: 'de', name: '', description: '' },
    { languageCode: 'fr', name: '', description: '' },
    { languageCode: 'ar', name: '', description: '' }
  ]);

  useEffect(() => {
    if (isOpen && group) {
      loadParents();
      loadEducationModels();
      if (definition && mode !== 'create') {
        populateForm();
      } else {
        resetForm();
      }
    }
  }, [isOpen, group, definition, mode]);

  const loadParents = async () => {
    if (!group) return;
    try {
      const data = await getDefinitions({ groupKey: group.code });
      setParents(data);
    } catch (error) {
      console.error('Failed to load parents:', error);
    }
  };

  const loadEducationModels = async () => {
    try {
      const data = await getEducationModels();
      setEducationModels(data);
    } catch (error) {
      console.error('Failed to load education models:', error);
    }
  };

  const populateForm = () => {
    if (!definition) return;
    
    setCode(definition.code);
    setName(definition.name);
    setDescription(definition.description || '');
    setColor(definition.color || '');
    setIcon(definition.icon || '');
    setDisplayOrder(definition.displayOrder);
    setIsDefault(definition.isDefault);
    setIsActive(definition.isActive);
    setSelectedParentId(definition.parentId || '');
    setSelectedEducationModelId(definition.educationModelId || '');

    if (definition.translations && definition.translations.length > 0) {
      const updatedTranslations = translations.map(t => {
        const existing = definition.translations.find(dt => dt.languageCode === t.languageCode);
        return existing || t;
      });
      setTranslations(updatedTranslations);
    }
  };

  const resetForm = () => {
    setCode('');
    setName('');
    setDescription('');
    setColor(group ? getGroupColor(group.code) : '');
    setIcon('');
    setDisplayOrder(0);
    setIsDefault(false);
    setIsActive(true);
    setSelectedParentId(parentId || '');
    setSelectedEducationModelId('');
    setTranslations([
      { languageCode: 'en', name: '', description: '' },
      { languageCode: 'de', name: '', description: '' },
      { languageCode: 'fr', name: '', description: '' },
      { languageCode: 'ar', name: '', description: '' }
    ]);
  };

  const handleSubmit = async () => {
    if (!group) return;

    setLoading(true);
    try {
      if (mode === 'create') {
        const request: CreateDefinitionRequest = {
          groupId: group.id,
          groupKey: group.code,
          parentId: selectedParentId || undefined,
          code,
          name,
          description: description || undefined,
          color: color || undefined,
          icon: icon || undefined,
          isDefault,
          displayOrder,
          educationModelId: selectedEducationModelId || undefined,
          translations: translations.filter(t => t.name.trim() !== '')
        };
        await createDefinition(request);
      } else if (mode === 'edit' && definition) {
        const request: UpdateDefinitionRequest = {
          name,
          description: description || undefined,
          color: color || undefined,
          icon: icon || undefined,
          isDefault,
          displayOrder,
          isActive,
          educationModelId: selectedEducationModelId || undefined
        };
        await updateDefinition(definition.id, request);
      }
      onSave();
    } catch (error) {
      console.error('Failed to save definition:', error);
      alert('Kaydetme işlemi başarısız oldu.');
    } finally {
      setLoading(false);
    }
  };

  const updateTranslation = (index: number, field: 'name' | 'description', value: string) => {
    const updated = [...translations];
    updated[index] = { ...updated[index], [field]: value };
    setTranslations(updated);
  };

  if (!isOpen || !group) return null;

  const isReadOnly = mode === 'view';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4">
          <h2 className="text-2xl font-bold flex items-center space-x-2">
            <span>{group.icon}</span>
            <span>
              {mode === 'create' && `Yeni ${group.name} Oluştur`}
              {mode === 'edit' && `${group.name} Düzenle`}
              {mode === 'view' && `${group.name} Detayları`}
            </span>
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('basic')}
            className={`px-6 py-3 font-semibold ${
              activeTab === 'basic'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📝 Temel Bilgiler
          </button>
          <button
            onClick={() => setActiveTab('translations')}
            className={`px-6 py-3 font-semibold ${
              activeTab === 'translations'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🌍 Çeviriler
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
          {activeTab === 'basic' && (
            <div className="space-y-4">
              {/* Education Model Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🎓 Eğitim Modeli <span className="text-gray-400 text-xs">(Opsiyonel)</span>
                </label>
                <select
                  value={selectedEducationModelId}
                  onChange={(e) => setSelectedEducationModelId(e.target.value)}
                  disabled={isReadOnly}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                >
                  <option value="">-- Tüm Eğitim Modelleri --</option>
                  {educationModels.map(model => (
                    <option key={model.id} value={model.id}>
                      {model.name} ({model.code}) - {model.country}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Bu tanımı belirli bir eğitim modeline bağlamak için seçim yapabilirsiniz.
                </p>
              </div>

              {/* Parent Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Üst Tanım
                </label>
                <select
                  value={selectedParentId}
                  onChange={(e) => setSelectedParentId(e.target.value)}
                  disabled={isReadOnly || mode === 'edit'}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                >
                  <option value="">-- Üst Seviye --</option>
                  {parents.map(parent => (
                    <option key={parent.id} value={parent.id}>
                      {parent.name} ({parent.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Code */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Kod *
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  disabled={isReadOnly || mode === 'edit'}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  placeholder="Örn: MATH.ALG.EQ"
                />
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  İsim *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isReadOnly}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  placeholder="Örn: Denklemler"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Açıklama
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isReadOnly}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  placeholder="Açıklama giriniz..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Color */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Renk
                  </label>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    disabled={isReadOnly}
                    className="w-full h-10 border border-gray-300 rounded-lg disabled:bg-gray-100"
                  />
                </div>

                {/* Icon */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    İkon (Emoji)
                  </label>
                  <input
                    type="text"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    disabled={isReadOnly}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    placeholder="📚"
                  />
                </div>
              </div>

              {/* Display Order */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Sıra
                </label>
                <input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(parseInt(e.target.value))}
                  disabled={isReadOnly}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>

              {/* Checkboxes */}
              {!isReadOnly && (
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={isDefault}
                      onChange={(e) => setIsDefault(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-700">Varsayılan</span>
                  </label>
                  {mode === 'edit' && (
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-gray-700">Aktif</span>
                    </label>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'translations' && (
            <div className="space-y-6">
              {translations.map((translation, index) => (
                <div
                  key={translation.languageCode}
                  className={`p-4 border rounded-lg ${
                    translation.languageCode === 'ar' ? 'bg-amber-50 border-amber-300' : 'bg-gray-50'
                  }`}
                >
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                    <span className="text-2xl">
                      {translation.languageCode === 'en' && '🇬🇧'}
                      {translation.languageCode === 'de' && '🇩🇪'}
                      {translation.languageCode === 'fr' && '🇫🇷'}
                      {translation.languageCode === 'ar' && '🇸🇦'}
                    </span>
                    <span>
                      {translation.languageCode === 'en' && 'İngilizce'}
                      {translation.languageCode === 'de' && 'Almanca'}
                      {translation.languageCode === 'fr' && 'Fransızca'}
                      {translation.languageCode === 'ar' && 'Arapça'}
                    </span>
                  </h4>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={translation.name}
                      onChange={(e) => updateTranslation(index, 'name', e.target.value)}
                      disabled={isReadOnly}
                      placeholder="İsim"
                      dir={translation.languageCode === 'ar' ? 'rtl' : 'ltr'}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                    <textarea
                      value={translation.description || ''}
                      onChange={(e) => updateTranslation(index, 'description', e.target.value)}
                      disabled={isReadOnly}
                      placeholder="Açıklama"
                      dir={translation.languageCode === 'ar' ? 'rtl' : 'ltr'}
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-100 px-6 py-4 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            {isReadOnly ? 'Kapat' : 'İptal'}
          </button>
          {!isReadOnly && (
            <button
              onClick={handleSubmit}
              disabled={loading || !name || !code}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? '⏳ Kaydediliyor...' : '💾 Kaydet'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

