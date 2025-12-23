interface QuestionMetadataProps {
  difficulty: string;
  subject: string;
  topic: string;
  points: number;
  estimatedTime: number;
  onChange: (field: string, value: string | number) => void;
}

const difficulties = ['Kolay', 'Orta', 'Zor'];
const subjects = ['Matematik', 'Fizik', 'Kimya', 'Biyoloji', 'Türkçe', 'İngilizce'];

export default function QuestionMetadata({
  difficulty,
  subject,
  topic,
  points,
  estimatedTime,
  onChange,
}: QuestionMetadataProps) {
  return (
    <div className="card bg-base-200 shadow-md">
      <div className="card-body">
        <h3 className="card-title text-lg">Soru Özellikleri</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Zorluk</span>
            </label>
            <select
              className="select select-bordered select-sm"
              value={difficulty}
              onChange={(e) => onChange('difficulty', e.target.value)}
            >
              <option value="">Seçin</option>
              {difficulties.map((d) => (
                <option key={d} value={d.toLowerCase()}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Ders</span>
            </label>
            <select
              className="select select-bordered select-sm"
              value={subject}
              onChange={(e) => onChange('subject', e.target.value)}
            >
              <option value="">Seçin</option>
              {subjects.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Konu</span>
            </label>
            <input
              type="text"
              className="input input-bordered input-sm"
              value={topic}
              onChange={(e) => onChange('topic', e.target.value)}
              placeholder="Örn: Trigonometri"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Puan</span>
            </label>
            <input
              type="number"
              className="input input-bordered input-sm"
              value={points}
              onChange={(e) => onChange('points', parseInt(e.target.value) || 0)}
              min="1"
              max="100"
            />
          </div>

          <div className="form-control col-span-2">
            <label className="label">
              <span className="label-text">Tahmini Süre (dakika)</span>
            </label>
            <input
              type="number"
              className="input input-bordered input-sm"
              value={estimatedTime}
              onChange={(e) => onChange('estimatedTime', parseInt(e.target.value) || 0)}
              min="1"
              max="60"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

