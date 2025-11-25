import { useState } from "react";
import Button from "../common/Button";
import Input from "../common/Input";
import Textarea from "../common/Textarea";
import Tabs from "../common/Tabs";
import curriculumServiceEnhanced, {
  CreateSubjectRequest,
} from "../../services/api/curriculumServiceEnhanced";

interface SubjectCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const SubjectCreateModal = ({
  isOpen,
  onClose,
  onSuccess,
}: SubjectCreateModalProps) => {
  const [activeTab, setActiveTab] = useState("basic");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<CreateSubjectRequest>({
    code: "",
    name: "",
    description: "",
    iconUrl: "",
    displayOrder: 1,
    tags: [],
    isActive: true,
  });

  const [translations, setTranslations] = useState<
    Record<string, { name: string; description: string }>
  >({
    en: { name: "", description: "" },
    de: { name: "", description: "" },
    fr: { name: "", description: "" },
    ar: { name: "", description: "" },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (!formData.code.trim()) {
      setError("Branş kodu zorunludur");
      setActiveTab("basic");
      return;
    }
    if (!formData.name.trim()) {
      setError("Branş adı zorunludur");
      setActiveTab("basic");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const subject = await curriculumServiceEnhanced.createSubject(formData);

      // Save translations if any provided
      const hasTranslations = Object.values(translations).some(
        (t) => t.name.trim() || t.description.trim()
      );

      if (hasTranslations) {
        const translationsToSave: Record<string, Record<string, string>> = {};
        Object.keys(translations).forEach((lang) => {
          if (
            translations[lang].name.trim() ||
            translations[lang].description.trim()
          ) {
            translationsToSave[lang] = {};
            if (translations[lang].name.trim()) {
              translationsToSave[lang]["Name"] = translations[lang].name;
            }
            if (translations[lang].description.trim()) {
              translationsToSave[lang]["Description"] =
                translations[lang].description;
            }
          }
        });

        if (Object.keys(translationsToSave).length > 0) {
          await curriculumServiceEnhanced.saveTranslations({
            entityType: "Subject",
            entityId: subject.id,
            translations: translationsToSave,
          });
        }
      }

      alert("Branş başarıyla oluşturuldu!");
      onSuccess();
      handleClose();
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Branş oluşturulurken bir hata oluştu"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      code: "",
      name: "",
      description: "",
      iconUrl: "",
      displayOrder: 1,
      tags: [],
      isActive: true,
    });
    setTranslations({
      en: { name: "", description: "" },
      de: { name: "", description: "" },
      fr: { name: "", description: "" },
      ar: { name: "", description: "" },
    });
    setActiveTab("basic");
    setError("");
    onClose();
  };

  const tabs = [
    {
      id: "basic",
      label: "Temel Bilgiler",
      icon: "fas fa-info-circle",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Branş Kodu"
              name="code"
              placeholder="MATH, PHYS, CHEM, ENG..."
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value.toUpperCase() })
              }
            />
            <Input
              label="Sıralama"
              type="number"
              name="displayOrder"
              value={formData.displayOrder.toString()}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  displayOrder: parseInt(e.target.value) || 1,
                })
              }
            />
          </div>

          <Input
            label="Branş Adı (Türkçe)"
            name="name"
            placeholder="Matematik, Fizik, İngilizce..."
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <Textarea
            label="Açıklama (Türkçe)"
            name="description"
            rows={3}
            placeholder="Branş açıklaması..."
            value={formData.description || ""}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

          <Input
            label="İkon URL (Opsiyonel)"
            name="iconUrl"
            placeholder="https://example.com/icon.png"
            value={formData.iconUrl || ""}
            onChange={(e) =>
              setFormData({ ...formData, iconUrl: e.target.value })
            }
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData({ ...formData, isActive: e.target.checked })
              }
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label
              htmlFor="isActive"
              className="text-sm font-medium text-gray-700"
            >
              Aktif
            </label>
          </div>
        </div>
      ),
    },
    {
      id: "translations",
      label: "Çeviriler",
      icon: "fas fa-language",
      content: (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <i className="fas fa-info-circle mr-2"></i>
              Branşın farklı dillerdeki karşılıklarını girin. Boş bırakılan
              alanlar kaydedilmez.
            </p>
          </div>

          {/* English */}
          <div className="border border-gray-200 rounded-lg p-4 space-y-3">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <span className="text-2xl">🇬🇧</span> English
            </h4>
            <Input
              label="Name"
              placeholder="Mathematics, Physics..."
              value={translations.en.name}
              onChange={(e) =>
                setTranslations({
                  ...translations,
                  en: { ...translations.en, name: e.target.value },
                })
              }
            />
            <Textarea
              label="Description"
              rows={2}
              placeholder="Subject description..."
              value={translations.en.description}
              onChange={(e) =>
                setTranslations({
                  ...translations,
                  en: { ...translations.en, description: e.target.value },
                })
              }
            />
          </div>

          {/* German */}
          <div className="border border-gray-200 rounded-lg p-4 space-y-3">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <span className="text-2xl">🇩🇪</span> Deutsch
            </h4>
            <Input
              label="Name"
              placeholder="Mathematik, Physik..."
              value={translations.de.name}
              onChange={(e) =>
                setTranslations({
                  ...translations,
                  de: { ...translations.de, name: e.target.value },
                })
              }
            />
            <Textarea
              label="Beschreibung"
              rows={2}
              placeholder="Fachbeschreibung..."
              value={translations.de.description}
              onChange={(e) =>
                setTranslations({
                  ...translations,
                  de: { ...translations.de, description: e.target.value },
                })
              }
            />
          </div>

          {/* French */}
          <div className="border border-gray-200 rounded-lg p-4 space-y-3">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <span className="text-2xl">🇫🇷</span> Français
            </h4>
            <Input
              label="Nom"
              placeholder="Mathématiques, Physique..."
              value={translations.fr.name}
              onChange={(e) =>
                setTranslations({
                  ...translations,
                  fr: { ...translations.fr, name: e.target.value },
                })
              }
            />
            <Textarea
              label="Description"
              rows={2}
              placeholder="Description du sujet..."
              value={translations.fr.description}
              onChange={(e) =>
                setTranslations({
                  ...translations,
                  fr: { ...translations.fr, description: e.target.value },
                })
              }
            />
          </div>

          {/* Arabic */}
          <div className="border border-gray-200 rounded-lg p-4 space-y-3">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <span className="text-2xl">🇸🇦</span> العربية
            </h4>
            <Input
              label="الاسم"
              placeholder="الرياضيات، الفيزياء..."
              value={translations.ar.name}
              onChange={(e) =>
                setTranslations({
                  ...translations,
                  ar: { ...translations.ar, name: e.target.value },
                })
              }
              dir="rtl"
            />
            <Textarea
              label="الوصف"
              rows={2}
              placeholder="وصف المادة..."
              value={translations.ar.description}
              onChange={(e) =>
                setTranslations({
                  ...translations,
                  ar: { ...translations.ar, description: e.target.value },
                })
              }
              dir="rtl"
            />
          </div>
        </div>
      ),
    },
  ];

  const currentTabIndex = tabs.findIndex((t) => t.id === activeTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            <i className="fas fa-book mr-2 text-blue-600"></i>
            Yeni Branş Ekle
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              <i className="fas fa-exclamation-circle mr-2"></i>
              {error}
            </div>
          )}

          <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </form>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-2">
            {currentTabIndex > 0 && (
              <Button
                type="button"
                variant="secondary"
                onClick={() => setActiveTab(tabs[currentTabIndex - 1].id)}
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Önceki
              </Button>
            )}
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="secondary" onClick={handleClose}>
              İptal
            </Button>
            {currentTabIndex < tabs.length - 1 ? (
              <Button
                type="button"
                onClick={() => setActiveTab(tabs[currentTabIndex + 1].id)}
              >
                Sonraki
                <i className="fas fa-arrow-right ml-2"></i>
              </Button>
            ) : (
              <Button type="submit" disabled={loading} onClick={handleSubmit}>
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Kaydediliyor...
                  </>
                ) : (
                  <>
                    <i className="fas fa-check mr-2"></i>
                    Kaydet
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectCreateModal;
