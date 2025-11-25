import { useState, useEffect } from "react";
import Button from "../common/Button";
import Input from "../common/Input";
import Textarea from "../common/Textarea";
import Select from "../common/Select";
import Tabs from "../common/Tabs";
import curriculumServiceEnhanced, {
  CreateTopicRequest,
  SubjectDto,
  TopicDto,
} from "../../services/api/curriculumServiceEnhanced";

interface TopicCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  subjectId?: string; // Pre-selected subject
  parentTopicId?: string; // For creating sub-topics
  level?: number; // Pre-selected level
}

const TopicCreateModal = ({
  isOpen,
  onClose,
  onSuccess,
  subjectId: preSelectedSubjectId,
  parentTopicId: preSelectedParentId,
  level: preSelectedLevel,
}: TopicCreateModalProps) => {
  const [activeTab, setActiveTab] = useState("basic");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [subjects, setSubjects] = useState<SubjectDto[]>([]);
  const [topics, setTopics] = useState<TopicDto[]>([]);

  const [formData, setFormData] = useState<CreateTopicRequest>({
    subjectId: preSelectedSubjectId || "",
    parentTopicId: preSelectedParentId || undefined,
    code: "",
    name: "",
    description: "",
    level: preSelectedLevel || 1,
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

  // Load subjects and topics on mount
  useEffect(() => {
    if (isOpen) {
      loadSubjects();
    }
  }, [isOpen]);

  useEffect(() => {
    if (formData.subjectId) {
      loadTopics(formData.subjectId);
    }
  }, [formData.subjectId]);

  const loadSubjects = async () => {
    try {
      const data = await curriculumServiceEnhanced.getSubjects();
      setSubjects(data || []);
    } catch (error) {
      console.error("Failed to load subjects:", error);
    }
  };

  const loadTopics = async (subjectId: string) => {
    try {
      const data = await curriculumServiceEnhanced.getTopics(subjectId);
      setTopics(data || []);
    } catch (error) {
      console.error("Failed to load topics:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (!formData.subjectId) {
      setError("Branş seçimi zorunludur");
      setActiveTab("basic");
      return;
    }
    if (!formData.code.trim()) {
      setError("Konu kodu zorunludur");
      setActiveTab("basic");
      return;
    }
    if (!formData.name.trim()) {
      setError("Konu adı zorunludur");
      setActiveTab("basic");
      return;
    }

    // Validate level-parent relationship
    if (formData.level > 1 && !formData.parentTopicId) {
      setError(`Level ${formData.level} için üst konu seçimi zorunludur`);
      setActiveTab("basic");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const topic = await curriculumServiceEnhanced.createTopic(formData);

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
            entityType: "Topic",
            entityId: topic.id,
            translations: translationsToSave,
          });
        }
      }

      alert("Konu başarıyla oluşturuldu!");
      onSuccess();
      handleClose();
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Konu oluşturulurken bir hata oluştu"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      subjectId: preSelectedSubjectId || "",
      parentTopicId: preSelectedParentId || undefined,
      code: "",
      name: "",
      description: "",
      level: preSelectedLevel || 1,
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

  const levelOptions = [
    { value: "1", label: "1️⃣ Konu (Ana Seviye)" },
    { value: "2", label: "2️⃣ Alt Konu (İkinci Seviye)" },
    { value: "3", label: "3️⃣ Başlık (Üçüncü Seviye)" },
  ];

  const getLevelColor = (level: number) => {
    switch (level) {
      case 1:
        return "bg-blue-100 text-blue-800";
      case 2:
        return "bg-green-100 text-green-800";
      case 3:
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const availableParentTopics = topics.filter((t) => t.level < formData.level);

  const tabs = [
    {
      id: "basic",
      label: "Temel Bilgiler",
      icon: "fas fa-info-circle",
      content: (
        <div className="space-y-4">
          {/* Subject & Level Selection */}
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Branş"
              value={formData.subjectId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  subjectId: e.target.value,
                  parentTopicId: undefined,
                })
              }
              disabled={!!preSelectedSubjectId}
            >
              <option value="">Branş Seçin</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </Select>

            <Select
              label="Seviye"
              value={formData.level.toString()}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  level: parseInt(e.target.value),
                  parentTopicId: undefined,
                })
              }
              disabled={!!preSelectedLevel}
            >
              {levelOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </div>

          {/* Level Badge */}
          <div
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${getLevelColor(formData.level)}`}
          >
            <i className="fas fa-layer-group"></i>
            <span className="font-medium">
              {formData.level === 1 && "Konu (Ana Seviye)"}
              {formData.level === 2 && "Alt Konu (İkinci Seviye)"}
              {formData.level === 3 && "Başlık (Üçüncü Seviye)"}
            </span>
          </div>

          {/* Parent Topic Selection (for level > 1) */}
          {formData.level > 1 && (
            <Select
              label="Üst Konu"
              value={formData.parentTopicId || ""}
              onChange={(e) =>
                setFormData({ ...formData, parentTopicId: e.target.value || undefined })
              }
              disabled={!!preSelectedParentId}
            >
              <option value="">Üst Konu Seçin</option>
              {availableParentTopics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {"—".repeat(topic.level - 1)} {topic.name} (Level {topic.level})
                </option>
              ))}
            </Select>
          )}

          {/* Code & Display Order */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Konu Kodu"
              name="code"
              placeholder="MAT.01, PHYS.02.01..."
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

          {/* Name & Description */}
          <Input
            label="Konu Adı (Türkçe)"
            name="name"
            placeholder="Cebirsel İfadeler, Kuvvet ve Hareket..."
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <Textarea
            label="Açıklama (Türkçe)"
            name="description"
            rows={3}
            placeholder="Konu açıklaması..."
            value={formData.description || ""}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

          {/* Active Status */}
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
              Konunun farklı dillerdeki karşılıklarını girin. Boş bırakılan
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
              placeholder="Algebraic Expressions, Force and Motion..."
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
              placeholder="Topic description..."
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
              placeholder="Algebraische Ausdrücke, Kraft und Bewegung..."
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
              placeholder="Themenbeschreibung..."
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
              placeholder="Expressions algébriques, Force et mouvement..."
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
              placeholder="التعبيرات الجبرية، القوة والحركة..."
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
              placeholder="وصف الموضوع..."
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
            <i className="fas fa-list-tree mr-2 text-blue-600"></i>
            Yeni Konu Ekle
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

export default TopicCreateModal;

