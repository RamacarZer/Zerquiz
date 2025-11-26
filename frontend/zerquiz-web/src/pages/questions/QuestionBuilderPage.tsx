import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { questionService } from "../../services/api/questionService";
import { curriculumService } from "../../services/api/curriculumService";
import RichTextEditor from "../../components/common/RichTextEditor";
import Button from "../../components/common/Button";
import DynamicAnswerFields from "../../components/questions/DynamicAnswerFields";
import { QuestionPresentationType } from "../../types/presentation.types";

interface QuestionOption {
  key: string;
  text: string;
  isCorrect: boolean;
}

export default function QuestionBuilderPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [saving, setSaving] = useState(false);

  // Data sources
  const [presentationTypes, setPresentationTypes] = useState<QuestionPresentationType[]>([]);
  const [difficultyLevels, setDifficultyLevels] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);

  // Question data
  const [selectedTypeId, setSelectedTypeId] = useState<string>("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [questionStem, setQuestionStem] = useState<string>("");
  const [options, setOptions] = useState<QuestionOption[]>([
    { key: "A", text: "", isCorrect: false },
    { key: "B", text: "", isCorrect: false },
    { key: "C", text: "", isCorrect: false },
    { key: "D", text: "", isCorrect: false },
  ]);
  const [textAnswer, setTextAnswer] = useState<string>("");
  const [numericAnswer, setNumericAnswer] = useState<number>(0);
  const [explanation, setExplanation] = useState<string>("");

  // Get selected presentation type object
  const selectedType = presentationTypes.find((t) => t.id === selectedTypeId) || null;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [types, difficulties, subjectsData] = await Promise.all([
        questionService.getPresentationTypes(),
        questionService.getDifficultyLevels(),
        curriculumService.getSubjects(),
      ]);

      setPresentationTypes(types);
      setDifficultyLevels(difficulties);
      setSubjects(subjectsData);
    } catch (error) {
      console.error("Failed to load data:", error);
    }
  };

  const steps = [
    { id: 0, title: "Soru Tipi", icon: "🎯" },
    { id: 1, title: "Zorluk & Branş", icon: "⚡" },
    { id: 2, title: "Soru Metni", icon: "📝" },
    { id: 3, title: "Seçenekler", icon: "✅" },
    { id: 4, title: "Açıklama", icon: "💡" },
    { id: 5, title: "Önizleme", icon: "👁️" },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleOptionChange = (index: number, text: string) => {
    const newOptions = [...options];
    newOptions[index].text = text;
    setOptions(newOptions);
  };

  const handleCorrectToggle = (index: number) => {
    const newOptions = options.map((opt, i) => ({
      ...opt,
      isCorrect: i === index,
    }));
    setOptions(newOptions);
  };

  const handleAddOption = () => {
    if (options.length < 6) {
      setOptions([
        ...options,
        { key: String.fromCharCode(65 + options.length), text: "", isCorrect: false },
      ]);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return selectedTypeId !== "";
      case 1:
        return selectedDifficulty !== "" && selectedSubject !== "";
      case 2:
        return questionStem.trim() !== "";
      case 3:
        // Dynamic validation based on answer type
        if (!selectedType) return false;
        if (!selectedType.requiresAnswer) return true; // No answer required
        
        if (selectedType.answerType === "options" || selectedType.answerType === "options_multiple") {
          return options.every((opt) => opt.text.trim() !== "") && options.some((opt) => opt.isCorrect);
        } else if (selectedType.answerType === "text_input" || selectedType.answerType === "text_long") {
          return true; // Text answer is optional as reference
        } else if (selectedType.answerType === "number") {
          return true; // Numeric answer
        } else if (selectedType.answerType === "boolean") {
          return options.some((opt) => opt.isCorrect);
        }
        return true;
      case 4:
        return true; // Açıklama opsiyonel
      case 5:
        return true;
      default:
        return false;
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const questionData = {
        formatTypeId: selectedType,
        difficultyLevelId: selectedDifficulty,
        subjectId: selectedSubject,
        content: {
          stem: { text: questionStem },
          options: options.map((opt) => ({
            key: opt.key,
            text: opt.text,
          })),
          correctAnswer: options.find((opt) => opt.isCorrect)?.key || "A",
        },
        explanation: explanation || undefined,
      };

      await questionService.createQuestion(questionData as any);
      alert("✅ Soru başarıyla oluşturuldu!");
      navigate("/questions");
    } catch (error) {
      console.error("Failed to save question:", error);
      alert("❌ Soru kaydedilemedi!");
    } finally {
      setSaving(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
              Soru Tipini Seçin
            </h2>
            <div className="mb-4">
              <input
                type="text"
                placeholder="🔍 Soru tipi ara..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                onChange={(e) => {
                  const search = e.target.value.toLowerCase();
                  // Filter logic can be added here
                }}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-2">
              {presentationTypes.map((type) => (
                <motion.button
                  key={type.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedTypeId(type.id)}
                  className={`p-5 border-2 rounded-xl text-left transition-all ${
                    selectedTypeId === type.id
                      ? "border-blue-500 bg-blue-50 shadow-lg"
                      : "border-gray-200 bg-white hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase">
                      {type.answerType}
                    </span>
                    {type.requiresAnswer ? (
                      <span className="text-green-500">✓</span>
                    ) : (
                      <span className="text-gray-400">ℹ️</span>
                    )}
                  </div>
                  <h3 className="font-bold text-base text-gray-900 mb-2 line-clamp-2">
                    {type.name}
                  </h3>
                  {type.description && (
                    <p className="text-xs text-gray-600 line-clamp-2">{type.description}</p>
                  )}
                </motion.button>
              ))}
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <p className="text-sm text-blue-800">
                💡 <strong>{presentationTypes.length} farklı soru tipi</strong> mevcut. 
                İhtiyacınıza en uygun olanı seçin!
              </p>
            </div>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-2xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
              Zorluk ve Branş
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Zorluk Seviyesi
              </label>
              <div className="grid grid-cols-5 gap-2">
                {difficultyLevels.map((level) => (
                  <motion.button
                    key={level.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedDifficulty(level.id)}
                    style={{ backgroundColor: level.color }}
                    className={`p-4 rounded-lg text-center font-semibold transition-all ${
                      selectedDifficulty === level.id
                        ? "ring-4 ring-blue-500 shadow-lg"
                        : "hover:shadow-md"
                    }`}
                  >
                    <div className="text-2xl mb-1">
                      {level.level === 1 && "😊"}
                      {level.level === 2 && "🙂"}
                      {level.level === 3 && "😐"}
                      {level.level === 4 && "😓"}
                      {level.level === 5 && "😰"}
                    </div>
                    <div className="text-xs">{level.name}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Branş
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg"
              >
                <option value="">Branş seçin...</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
              Soru Metnini Yazın
            </h2>
            <RichTextEditor
              value={questionStem}
              onChange={setQuestionStem}
              placeholder="Sorunuzu buraya yazın... (Markdown ve LaTeX desteklenir)"
              height={400}
            />
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                💡 <strong>İpucu:</strong> LaTeX formülleri için <code>\(...\)</code> kullanın.
                Örnek: <code>\(x^2 + y^2 = z^2\)</code>
              </p>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
              Cevap Alanları
            </h2>
            {selectedType && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎯</span>
                  <div>
                    <p className="font-semibold text-purple-900">{selectedType.name}</p>
                    <p className="text-sm text-purple-700">Cevap Tipi: {selectedType.answerType}</p>
                  </div>
                </div>
              </div>
            )}
            <DynamicAnswerFields
              presentationType={selectedType}
              options={options}
              onOptionsChange={setOptions}
              textAnswer={textAnswer}
              onTextAnswerChange={setTextAnswer}
              numericAnswer={numericAnswer}
              onNumericAnswerChange={setNumericAnswer}
            />
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
              Açıklama (Opsiyonel)
            </h2>
            <RichTextEditor
              value={explanation}
              onChange={setExplanation}
              placeholder="Sorunun çözümünü veya açıklamasını yazın..."
              height={300}
            />
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                ℹ️ Açıklama, öğrencilere doğru cevabın neden doğru olduğunu anlatır.
                Bu alan opsiyoneldir, boş bırakabilirsiniz.
              </p>
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
              Önizleme
            </h2>

            {/* Question preview card */}
            <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200">
              {/* Metadata */}
              <div className="flex items-center gap-3 mb-6">
                <span
                  className="px-3 py-1 rounded-full text-sm font-semibold"
                  style={{
                    backgroundColor:
                      difficultyLevels.find((d) => d.id === selectedDifficulty)
                        ?.color || "#e5e7eb",
                  }}
                >
                  {difficultyLevels.find((d) => d.id === selectedDifficulty)
                    ?.name || "Zorluk"}
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                  {subjects.find((s) => s.id === selectedSubject)?.name || "Branş"}
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                  {selectedType?.name || "Tip"}
                </span>
              </div>

              {/* Question stem */}
              <div className="mb-6">
                <div
                  className="prose max-w-none text-lg"
                  dangerouslySetInnerHTML={{ __html: questionStem }}
                />
              </div>

              {/* Options */}
              <div className="space-y-3">
                {options.map((option) => (
                  <div
                    key={option.key}
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 ${
                      option.isCorrect
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                      {option.key}
                    </span>
                    <span className="flex-1">{option.text}</span>
                    {option.isCorrect && (
                      <span className="text-green-600 font-bold">✓ Doğru</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Explanation */}
              {explanation && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="font-semibold text-blue-900 mb-2">
                    💡 Açıklama:
                  </div>
                  <div
                    className="prose max-w-none text-blue-800"
                    dangerouslySetInnerHTML={{ __html: explanation }}
                  />
                </div>
              )}
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/questions")}
              className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
            >
              ← Geri
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              Yeni Soru Oluştur
            </h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      {/* Progress steps */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-12">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <motion.div
                  animate={{
                    scale: currentStep === index ? 1.1 : 1,
                  }}
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold transition-all ${
                    currentStep === index
                      ? "bg-blue-600 text-white shadow-lg ring-4 ring-blue-200"
                      : currentStep > index
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step.icon}
                </motion.div>
                <div
                  className={`mt-2 text-sm font-medium ${
                    currentStep === index
                      ? "text-blue-600"
                      : currentStep > index
                      ? "text-green-600"
                      : "text-gray-500"
                  }`}
                >
                  {step.title}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-12 h-1 mx-2 ${
                    currentStep > index ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <AnimatePresence mode="wait">{renderStepContent()}</AnimatePresence>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between items-center">
          <Button
            onClick={handlePrev}
            disabled={currentStep === 0}
            variant="secondary"
          >
            ← Önceki
          </Button>

          <div className="text-sm text-gray-600">
            Adım {currentStep + 1} / {steps.length}
          </div>

          {currentStep < steps.length - 1 ? (
            <Button onClick={handleNext} disabled={!canProceed()}>
              Sonraki →
            </Button>
          ) : (
            <Button
              onClick={handleSave}
              disabled={!canProceed() || saving}
              variant="primary"
            >
              {saving ? "Kaydediliyor..." : "✅ Soruyu Kaydet"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

