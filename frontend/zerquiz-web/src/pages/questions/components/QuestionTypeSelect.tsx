interface QuestionTypeSelectProps {
  value: string;
  onChange: (type: string) => void;
}

const questionTypes = [
  { value: 'multiple-choice', label: 'Çoktan Seçmeli' },
  { value: 'true-false', label: 'Doğru/Yanlış' },
  { value: 'fill-blank', label: 'Boşluk Doldurma' },
  { value: 'essay', label: 'Açık Uçlu' },
  { value: 'matching', label: 'Eşleştirme' },
];

export default function QuestionTypeSelect({ value, onChange }: QuestionTypeSelectProps) {
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text font-semibold">Soru Tipi</span>
      </label>
      <select
        className="select select-bordered w-full"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Soru tipi seçin</option>
        {questionTypes.map((type) => (
          <option key={type.value} value={type.value}>
            {type.label}
          </option>
        ))}
      </select>
    </div>
  );
}

