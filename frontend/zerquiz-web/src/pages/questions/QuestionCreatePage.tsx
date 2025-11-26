import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { questionService } from "../../services/api/questionService";
import { curriculumService } from "../../services/api/curriculumService";
import type {
  QuestionFormatType,
  QuestionPedagogicalType,
  CreateQuestionRequest,
  QuestionContent,
} from "../../types/question.types";
import type {
  Subject,
  Topic,
  LearningOutcome,
} from "../../types/curriculum.types";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Button from "../../components/common/Button";
import Tabs from "../../components/common/Tabs";
import RichTextEditor from "../../components/common/RichTextEditor";

type TabType = "basic" | "curriculum" | "content" | "preview";

export default function QuestionCreatePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("basic");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Data sources
  const [formatTypes, setFormatTypes] = useState<QuestionFormatType[]>([]);
  const [pedagogicalTypes, setPedagogicalTypes] = useState<
    QuestionPedagogicalType[]
  >([]);
  const [presentationTypes, setPresentationTypes] = useState<any[]>([]);
  const [difficultyLevels, setDifficultyLevels] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [outcomes, setOutcomes] = useState<LearningOutcome[]>([]);

  // Form data
  const [formData, setFormData] = useState<Partial<CreateQuestionRequest>>({
    difficulty: "medium",
    weight: 1.0,
    content: {
      stem: { text: "" },
      options: [
        { key: "A", text: "" },
        { key: "B", text: "" },
        { key: "C", text: "" },
        { key: "D", text: "" },
      ],
      correctAnswers: [],
    },
  });

  // Load initial data
  useEffect(() => {
    loadFormatTypes();
    loadPedagogicalTypes();
    loadPresentationTypes();
    loadDifficultyLevels();
    loadSubjects();
  }, []);

  // Load topics when subject changes
  useEffect(() => {
    if (formData.subjectId) {
      loadTopics(formData.subjectId);
    }
  }, [formData.subjectId]);

  // Load outcomes when topic changes
  useEffect(() => {
    if (formData.topicId) {
      loadOutcomes(formData.topicId);
    }
  }, [formData.topicId]);

  const loadFormatTypes = async () => {
    try {
      const data = await questionService.getFormatTypes();
      setFormatTypes(data);
      if (data.length > 0 && !formData.formatTypeId) {
        setFormData((prev) => ({ ...prev, formatTypeId: data[0].id }));
      }
    } catch (err) {
      console.error("Failed to load format types:", err);
    }
  };

  const loadPedagogicalTypes = async () => {
    try {
      const data = await questionService.getPedagogicalTypes();
      setPedagogicalTypes(data);
    } catch (err) {
      console.error("Failed to load pedagogical types:", err);
    }
  };

  const loadPresentationTypes = async () => {
    try {
      const data = await questionService.getPresentationTypes();
      setPresentationTypes(data);
    } catch (err) {
      console.error("Failed to load presentation types:", err);
    }
  };

  const loadDifficultyLevels = async () => {
    try {
      const data = await questionService.getDifficultyLevels();
      setDifficultyLevels(data);
    } catch (err) {
      console.error("Failed to load difficulty levels:", err);
    }
  };

  const loadSubjects = async () => {
    try {
      const data = await curriculumService.getSubjects();
      setSubjects(data);
    } catch (err) {
      console.error("Failed to load subjects:", err);
    }
  };

  const loadTopics = async (subjectId: string) => {
    try {
      const data = await curriculumService.getTopics({ subjectId });
      setTopics(data);
    } catch (err) {
      console.error("Failed to load topics:", err);
    }
  };

  const loadOutcomes = async (topicId: string) => {
    try {
      const data = await curriculumService.getLearningOutcomes({ topicId });
      setOutcomes(data);
    } catch (err) {
      console.error("Failed to load outcomes:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.formatTypeId || !formData.subjectId) {
      setError("Lütfen tüm zorunlu alanları doldurun");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await questionService.createQuestion(formData as CreateQuestionRequest);
      navigate("/questions");
    } catch (err: any) {
      setError(err.response?.data?.message || "Soru oluşturulamadı");
    } finally {
      setLoading(false);
    }
  };

  const updateContent = (updates: Partial<QuestionContent>) => {
    setFormData((prev) => ({
      ...prev,
      content: { ...prev.content, ...updates } as QuestionContent,
    }));
  };

  const addOption = () => {
    const keys = ["A", "B", "C", "D", "E", "F", "G", "H"];
    const currentOptions = formData.content?.options || [];
    const nextKey = keys[currentOptions.length];
    if (nextKey) {
      updateContent({
        options: [...currentOptions, { key: nextKey, text: "" }],
      });
    }
  };

  const removeOption = (index: number) => {
    const currentOptions = formData.content?.options || [];
    updateContent({
      options: currentOptions.filter((_, i) => i !== index),
    });
  };

  const updateOption = (index: number, text: string) => {
    const currentOptions = formData.content?.options || [];
    const updated = [...currentOptions];
    updated[index] = { ...updated[index], text };
    updateContent({ options: updated });
  };

  const toggleCorrectAnswer = (key: string) => {
    const current = formData.content?.correctAnswers || [];
    const updated = current.includes(key)
      ? current.filter((k) => k !== key)
      : [...current, key];
    updateContent({ correctAnswers: updated });
  };

  const tabs = [
    { id: "basic", label: "Temel Bilgiler" },
    { id: "curriculum", label: "Müfredat" },
    { id: "content", label: "İçerik" },
    { id: "preview", label: "Önizleme" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate("/questions")}
              className="text-gray-600 hover:text-gray-900"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Yeni Soru Oluştur
              </h1>
              <p className="text-gray-600 mt-1">
                Soru bankasına yeni soru ekleyin
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow">
          {/* Tabs */}
          <div className="border-b">
            <Tabs
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={(id) => setActiveTab(id as TabType)}
            />
          </div>

          <div className="p-6">
            {/* Basic Info Tab */}
            {activeTab === "basic" && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <Select
                    label="Soru Formatı *"
                    value={formData.formatTypeId || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, formatTypeId: e.target.value })
                    }
                    required
                  >
                    <option value="">Seçiniz</option>
                    {formatTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </Select>

                  <Select
                    label="Pedagojik Tip"
                    value={formData.pedagogicalTypeId || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pedagogicalTypeId: e.target.value,
                      })
                    }
                  >
                    <option value="">Seçiniz</option>
                    {pedagogicalTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <Select
                    label="Zorluk Seviyesi *"
                    value={formData.difficulty || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, difficulty: e.target.value })
                    }
                    required
                  >
                    <option value="">Seçiniz</option>
                    {difficultyLevels.map((level) => (
                      <option key={level.id} value={level.code}>
                        {level.name}
                      </option>
                    ))}
                  </Select>

                  <Input
                    label="Ağırlık"
                    type="number"
                    step="0.1"
                    value={formData.weight || 1.0}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        weight: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
            )}

            {/* Curriculum Tab */}
            {activeTab === "curriculum" && (
              <div className="space-y-6">
                <Select
                  label="Branş *"
                  value={formData.subjectId || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, subjectId: e.target.value })
                  }
                  required
                >
                  <option value="">Seçiniz</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </Select>

                {formData.subjectId && (
                  <Select
                    label="Konu"
                    value={formData.topicId || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, topicId: e.target.value })
                    }
                  >
                    <option value="">Seçiniz</option>
                    {topics.map((topic) => (
                      <option key={topic.id} value={topic.id}>
                        {topic.name}
                      </option>
                    ))}
                  </Select>
                )}

                {formData.topicId && (
                  <Select
                    label="Kazanım"
                    value={formData.learningOutcomeId || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        learningOutcomeId: e.target.value,
                      })
                    }
                  >
                    <option value="">Seçiniz</option>
                    {outcomes.map((outcome) => (
                      <option key={outcome.id} value={outcome.id}>
                        {outcome.code} - {outcome.description}
                      </option>
                    ))}
                  </Select>
                )}
              </div>
            )}

            {/* Content Tab */}
            {activeTab === "content" && (
              <div className="space-y-6">
                {/* Soru Sunum Şekli */}
                <div>
                  <Select
                    label="Soru Sunum Şekli"
                    value=""
                    onChange={(e) => {
                      // Handle presentation type change
                    }}
                  >
                    <option value="">Seçiniz</option>
                    {presentationTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </Select>
                  {presentationTypes.length === 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      Sunum şekilleri yükleniyor...
                    </p>
                  )}
                </div>

                <RichTextEditor
                  label="Soru Metni"
                  value={formData.content?.stem?.text || ""}
                  onChange={(content) =>
                    updateContent({ stem: { text: content } })
                  }
                  placeholder="Soru metnini buraya yazın..."
                  height={250}
                  required
                />

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Şıklar *
                    </label>
                    <button
                      type="button"
                      onClick={addOption}
                      className="text-sm text-blue-600 hover:text-blue-700"
                      disabled={(formData.content?.options?.length || 0) >= 8}
                    >
                      + Şık Ekle
                    </button>
                  </div>
                  <div className="space-y-3">
                    {formData.content?.options?.map((option, index) => (
                      <div key={option.key} className="flex gap-3 items-start">
                        <div className="flex items-center pt-2">
                          <input
                            type="checkbox"
                            checked={formData.content?.correctAnswers?.includes(
                              option.key
                            )}
                            onChange={() => toggleCorrectAnswer(option.key)}
                            className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                            title="Doğru cevap"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex gap-2 items-center">
                            <span className="text-sm font-medium text-gray-700 min-w-[24px]">
                              {option.key})
                            </span>
                            <input
                              type="text"
                              value={option.text}
                              onChange={(e) =>
                                updateOption(index, e.target.value)
                              }
                              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder={`${option.key} şıkkı...`}
                              required
                            />
                            {index > 1 && (
                              <button
                                type="button"
                                onClick={() => removeOption(index)}
                                className="text-red-600 hover:text-red-700"
                                title="Kaldır"
                              >
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    ✓ Doğru cevabı işaretleyin
                  </p>
                </div>
              </div>
            )}

            {/* Preview Tab */}
            {activeTab === "preview" && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-4">
                    Soru Önizleme
                  </h3>
                  <div className="bg-white rounded-lg p-6">
                    <div className="prose max-w-none">
                      <p className="text-gray-900 mb-4">
                        {formData.content?.stem?.text ||
                          "(Soru metni girilmedi)"}
                      </p>
                      <div className="space-y-2">
                        {formData.content?.options?.map((option) => (
                          <div
                            key={option.key}
                            className={`p-3 rounded-lg border ${
                              formData.content?.correctAnswers?.includes(
                                option.key
                              )
                                ? "bg-green-50 border-green-300"
                                : "border-gray-200"
                            }`}
                          >
                            <span className="font-medium mr-2">
                              {option.key})
                            </span>
                            {option.text || "(Boş)"}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Soru Bilgileri
                  </h4>
                  <dl className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <dt className="text-gray-600">Format:</dt>
                      <dd className="font-medium">
                        {formatTypes.find((f) => f.id === formData.formatTypeId)
                          ?.name || "-"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-gray-600">Zorluk:</dt>
                      <dd className="font-medium">
                        {formData.difficulty === "easy"
                          ? "Kolay"
                          : formData.difficulty === "medium"
                          ? "Orta"
                          : "Zor"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-gray-600">Branş:</dt>
                      <dd className="font-medium">
                        {subjects.find((s) => s.id === formData.subjectId)
                          ?.name || "-"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-gray-600">Doğru Cevap:</dt>
                      <dd className="font-medium text-green-600">
                        {formData.content?.correctAnswers?.join(", ") || "-"}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="border-t px-6 py-4 bg-gray-50 rounded-b-lg flex justify-between">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/questions")}
            >
              İptal
            </Button>

            <div className="flex gap-3">
              {activeTab !== "basic" && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    const tabs: TabType[] = [
                      "basic",
                      "curriculum",
                      "content",
                      "preview",
                    ];
                    const currentIndex = tabs.indexOf(activeTab);
                    setActiveTab(tabs[currentIndex - 1]);
                  }}
                >
                  Geri
                </Button>
              )}

              {activeTab !== "preview" ? (
                <Button
                  type="button"
                  onClick={() => {
                    const tabs: TabType[] = [
                      "basic",
                      "curriculum",
                      "content",
                      "preview",
                    ];
                    const currentIndex = tabs.indexOf(activeTab);
                    setActiveTab(tabs[currentIndex + 1]);
                  }}
                >
                  İleri
                </Button>
              ) : (
                <Button type="submit" disabled={loading}>
                  {loading ? "Kaydediliyor..." : "Kaydet"}
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
