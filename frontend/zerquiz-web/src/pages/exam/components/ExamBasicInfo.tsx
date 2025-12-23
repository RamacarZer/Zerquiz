interface ExamBasicInfoProps {
  title: string;
  description: string;
  duration: number;
  totalPoints: number;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onDurationChange: (value: number) => void;
  onTotalPointsChange: (value: number) => void;
}

export default function ExamBasicInfo({
  title,
  description,
  duration,
  totalPoints,
  onTitleChange,
  onDescriptionChange,
  onDurationChange,
  onTotalPointsChange,
}: ExamBasicInfoProps) {
  return (
    <div className="card bg-white shadow-xl">
      <div className="card-body space-y-4">
        <h2 className="card-title">Sınav Bilgileri</h2>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Sınav Başlığı *</span>
          </label>
          <input
            type="text"
            className="input input-bordered"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Örn: Matematik 1. Dönem Ara Sınavı"
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Açıklama</span>
          </label>
          <textarea
            className="textarea textarea-bordered h-24"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Sınav hakkında açıklama..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Süre (dakika) *</span>
            </label>
            <input
              type="number"
              className="input input-bordered"
              value={duration}
              onChange={(e) => onDurationChange(parseInt(e.target.value) || 0)}
              min="1"
              max="480"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Toplam Puan *</span>
            </label>
            <input
              type="number"
              className="input input-bordered"
              value={totalPoints}
              onChange={(e) => onTotalPointsChange(parseInt(e.target.value) || 0)}
              min="1"
              max="1000"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

