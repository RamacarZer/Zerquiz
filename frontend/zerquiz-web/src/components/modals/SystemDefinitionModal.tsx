import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { SystemDefinition } from '@/services/api/systemService';

interface SystemDefinitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (definition: Partial<SystemDefinition>) => void;
  definition?: SystemDefinition | null;
  categories: string[];
}

export default function SystemDefinitionModal({
  isOpen,
  onClose,
  onSave,
  definition,
  categories,
}: SystemDefinitionModalProps) {
  const [formData, setFormData] = useState<Partial<SystemDefinition>>({
    category: '',
    code: '',
    name: '',
    description: '',
    nameTr: '',
    nameEn: '',
    nameAr: '',
    descriptionTr: '',
    descriptionEn: '',
    descriptionAr: '',
    displayOrder: 0,
    icon: '',
    color: '',
    isActive: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (definition) {
      setFormData(definition);
    } else {
      setFormData({
        category: '',
        code: '',
        name: '',
        description: '',
        nameTr: '',
        nameEn: '',
        nameAr: '',
        descriptionTr: '',
        descriptionEn: '',
        descriptionAr: '',
        displayOrder: 0,
        icon: '',
        color: '',
        isActive: true,
      });
    }
  }, [definition]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'number' ? parseInt(value, 10) : type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {definition ? 'Sistem Tanımını Düzenle' : 'Yeni Sistem Tanımı'}
          </h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Kategori *
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                list="categories"
                required
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
              <datalist id="categories">
                {categories.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Kod *
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sıralama
              </label>
              <input
                type="number"
                name="displayOrder"
                value={formData.displayOrder}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Renk
              </label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                placeholder="#3B82F6"
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Multi-language Names */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              İsimler (Çoklu Dil)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Türkçe *
                </label>
                <input
                  type="text"
                  name="nameTr"
                  value={formData.nameTr}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  English
                </label>
                <input
                  type="text"
                  name="nameEn"
                  value={formData.nameEn}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  عربي
                </label>
                <input
                  type="text"
                  name="nameAr"
                  value={formData.nameAr}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          {/* Multi-language Descriptions */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Açıklamalar (Çoklu Dil)
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Türkçe
                </label>
                <textarea
                  name="descriptionTr"
                  value={formData.descriptionTr}
                  onChange={handleChange}
                  rows={2}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  English
                </label>
                <textarea
                  name="descriptionEn"
                  value={formData.descriptionEn}
                  onChange={handleChange}
                  rows={2}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  عربي
                </label>
                <textarea
                  name="descriptionAr"
                  value={formData.descriptionAr}
                  onChange={handleChange}
                  rows={2}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          {/* Active Status */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Aktif
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Kaydediliyor...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Kaydet
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

