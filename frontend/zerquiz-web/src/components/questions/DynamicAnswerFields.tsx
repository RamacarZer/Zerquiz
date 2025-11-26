import { motion } from "framer-motion";
import { QuestionPresentationType } from "../../types/presentation.types";
import RichTextEditor from "../common/RichTextEditor";

interface DynamicAnswerFieldsProps {
  presentationType: QuestionPresentationType | null;
  options: Array<{ key: string; text: string; isCorrect: boolean }>;
  onOptionsChange: (options: Array<{ key: string; text: string; isCorrect: boolean }>) => void;
  textAnswer?: string;
  onTextAnswerChange?: (value: string) => void;
  numericAnswer?: number;
  onNumericAnswerChange?: (value: number) => void;
}

export default function DynamicAnswerFields({
  presentationType,
  options,
  onOptionsChange,
  textAnswer,
  onTextAnswerChange,
  numericAnswer,
  onNumericAnswerChange
}: DynamicAnswerFieldsProps) {
  if (!presentationType) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>👆 Önce soru sunum şeklini seçin</p>
      </div>
    );
  }

  const handleOptionChange = (index: number, text: string) => {
    const newOptions = [...options];
    newOptions[index].text = text;
    onOptionsChange(newOptions);
  };

  const handleCorrectToggle = (index: number) => {
    const isMultiple = presentationType.answerType === "options_multiple";
    const newOptions = isMultiple
      ? options.map((opt, i) => (i === index ? { ...opt, isCorrect: !opt.isCorrect } : opt))
      : options.map((opt, i) => ({ ...opt, isCorrect: i === index }));
    onOptionsChange(newOptions);
  };

  const handleAddOption = () => {
    const maxOptions = presentationType.maxOptions || 10;
    if (options.length < maxOptions) {
      onOptionsChange([
        ...options,
        { key: String.fromCharCode(65 + options.length), text: "", isCorrect: false },
      ]);
    }
  };

  const handleRemoveOption = (index: number) => {
    const minOptions = presentationType.minOptions || 2;
    if (options.length > minOptions) {
      onOptionsChange(options.filter((_, i) => i !== index));
    }
  };

  // ========== RENDER BY ANSWER TYPE ==========
  
  // 1) MULTIPLE CHOICE (Single or Multiple)
  if (presentationType.answerType === "options" || presentationType.answerType === "options_multiple") {
    const isMultiple = presentationType.answerType === "options_multiple";
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {isMultiple ? "Seçenekler (Çoklu Doğru)" : "Seçenekler (Tek Doğru)"}
          </h3>
          <span className="text-sm text-gray-600">
            {isMultiple ? "Birden fazla seçenek işaretlenebilir" : "Sadece bir seçenek işaretlenebilir"}
          </span>
        </div>

        <div className="space-y-3">
          {options.map((option, index) => (
            <motion.div
              key={option.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center gap-3 p-4 border-2 rounded-lg transition-all ${
                option.isCorrect ? "border-green-500 bg-green-50" : "border-gray-200 bg-white"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {option.key}
                </span>
                <input
                  type={isMultiple ? "checkbox" : "radio"}
                  name="correct-answer"
                  checked={option.isCorrect}
                  onChange={() => handleCorrectToggle(index)}
                  className="w-5 h-5 cursor-pointer"
                  title="Doğru cevap olarak işaretle"
                />
              </div>
              <input
                type="text"
                value={option.text}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`${option.key} seçeneği...`}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              {options.length > (presentationType.minOptions || 2) && (
                <button
                  onClick={() => handleRemoveOption(index)}
                  className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded"
                  title="Seçeneği sil"
                >
                  🗑️
                </button>
              )}
            </motion.div>
          ))}
        </div>

        {options.length < (presentationType.maxOptions || 10) && (
          <button
            onClick={handleAddOption}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-gray-600 hover:text-blue-600 font-medium"
          >
            ➕ Yeni Seçenek Ekle (Max: {presentationType.maxOptions || 10})
          </button>
        )}
      </div>
    );
  }

  // 2) TRUE/FALSE
  if (presentationType.answerType === "boolean") {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Doğru / Yanlış</h3>
        <div className="grid grid-cols-2 gap-4">
          {["Doğru", "Yanlış"].map((label, index) => (
            <motion.button
              key={label}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onOptionsChange([
                  { key: "A", text: "Doğru", isCorrect: index === 0 },
                  { key: "B", text: "Yanlış", isCorrect: index === 1 }
                ]);
              }}
              className={`p-6 rounded-xl border-2 font-semibold text-lg transition-all ${
                options[index]?.isCorrect
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-gray-200 bg-white text-gray-700 hover:border-blue-300"
              }`}
            >
              {index === 0 ? "✅" : "❌"} {label}
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  // 3) TEXT INPUT (Short Answer)
  if (presentationType.answerType === "text_input") {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Kısa Cevap</h3>
        <input
          type="text"
          value={textAnswer || ""}
          onChange={(e) => onTextAnswerChange && onTextAnswerChange(e.target.value)}
          placeholder="Doğru cevabı yazın..."
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg"
        />
        <p className="text-sm text-gray-600">
          💡 Öğrenci bu alana kısa bir metin yazacak. Tam eşleşme veya manuel puanlama yapılabilir.
        </p>
      </div>
    );
  }

  // 4) LONG TEXT (Essay)
  if (presentationType.answerType === "text_long") {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Uzun Cevap / Kompozisyon</h3>
        <RichTextEditor
          value={textAnswer || ""}
          onChange={(value) => onTextAnswerChange && onTextAnswerChange(value)}
          placeholder="Öğrenciden beklenen örnek cevap veya açıklama (opsiyonel)..."
          height={200}
        />
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            ⚠️ Bu soru tipi <strong>manuel puanlama</strong> gerektirir. Öğrenci uzun metin yazacak.
          </p>
        </div>
      </div>
    );
  }

  // 5) NUMERIC INPUT
  if (presentationType.answerType === "number") {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Sayısal Cevap</h3>
        <input
          type="number"
          step="any"
          value={numericAnswer || ""}
          onChange={(e) => onNumericAnswerChange && onNumericAnswerChange(parseFloat(e.target.value))}
          placeholder="Doğru sayısal değeri girin..."
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg"
        />
        <p className="text-sm text-gray-600">
          🔢 Öğrenci sadece sayı girebilir. Otomatik puanlama yapılır.
        </p>
      </div>
    );
  }

  // 6) MATCHING
  if (presentationType.answerType === "matching") {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Eşleştirme</h3>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            🔗 Eşleştirme soruları için özel editor geliştirme aşamasında. 
            Şimdilik standart seçenekler kullanılacak.
          </p>
        </div>
        {/* Fallback to options for now */}
        <div className="space-y-3">
          {options.map((option, index) => (
            <div key={option.key} className="flex items-center gap-3 p-3 border rounded-lg">
              <span className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                {option.key}
              </span>
              <input
                type="text"
                value={option.text}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Eşleştirme öğesi ${option.key}...`}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 7) ORDERING
  if (presentationType.answerType === "ordering") {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Sıralama</h3>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            📋 Sıralama soruları için drag-drop editor geliştirme aşamasında.
          </p>
        </div>
        <div className="space-y-3">
          {options.map((option, index) => (
            <div key={option.key} className="flex items-center gap-3 p-3 border rounded-lg">
              <span className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold">
                {index + 1}
              </span>
              <input
                type="text"
                value={option.text}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`${index + 1}. sıradaki öğe...`}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 8) NO ANSWER (Info only)
  if (presentationType.answerType === "none" || !presentationType.requiresAnswer) {
    return (
      <div className="space-y-4">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <div className="text-4xl mb-3">ℹ️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Bilgi Amaçlı Soru</h3>
          <p className="text-gray-600">
            Bu soru tipi cevap gerektirmez. Sadece bilgi vermek veya yönlendirme amaçlıdır.
          </p>
        </div>
      </div>
    );
  }

  // 9) FALLBACK - Advanced types (code, simulation, file upload, etc.)
  return (
    <div className="space-y-4">
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
        <div className="text-4xl mb-3 text-center">🚀</div>
        <h3 className="text-lg font-semibold text-purple-900 mb-2 text-center">
          Gelişmiş Soru Tipi: {presentationType.name}
        </h3>
        <p className="text-purple-700 text-center mb-4">
          Bu soru tipi için özel editor geliştirme aşamasında.
        </p>
        <div className="bg-white rounded p-4">
          <p className="text-sm text-gray-600">
            <strong>Cevap Tipi:</strong> {presentationType.answerType}
          </p>
          {presentationType.description && (
            <p className="text-sm text-gray-600 mt-2">
              <strong>Açıklama:</strong> {presentationType.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

