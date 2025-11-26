import { useState } from "react";
import { Slide, UpdateSlideRequest } from "../../services/api/presentationService";
import RichTextEditor from "../common/RichTextEditor";
import Input from "../common/Input";
import Select from "../common/Select";

interface SlideEditorProps {
  slide: Slide;
  onUpdate: (slideId: string, data: UpdateSlideRequest) => void;
}

export default function SlideEditor({ slide, onUpdate }: SlideEditorProps) {
  const [editedSlide, setEditedSlide] = useState<Slide>(slide);

  const handleChange = (field: keyof Slide, value: any) => {
    const updated = { ...editedSlide, [field]: value };
    setEditedSlide(updated);
    
    // Auto-save after a short delay
    setTimeout(() => {
      const updateData: UpdateSlideRequest = {
        title: updated.title,
        content: updated.content,
        imageUrl: updated.imageUrl,
        imageCaption: updated.imageCaption,
        leftColumn: updated.leftColumn,
        rightColumn: updated.rightColumn,
        questionId: updated.questionId,
        pollQuestion: updated.pollQuestion,
        pollOptions: updated.pollOptions,
        transition: updated.transition,
        duration: updated.duration,
        speakerNotes: updated.speakerNotes,
        backgroundColor: updated.backgroundColor,
        textColor: updated.textColor
      };
      onUpdate(slide.id, updateData);
    }, 500);
  };

  const renderEditorForType = () => {
    switch (slide.type) {
      case 'Title':
        return (
          <div className="space-y-4">
            <Input
              label="Başlık"
              value={editedSlide.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Sunum başlığınızı girin..."
            />
            <RichTextEditor
              label="Alt Başlık"
              value={editedSlide.content || ''}
              onChange={(value) => handleChange('content', value)}
              placeholder="Alt başlık veya açıklama..."
              height={150}
            />
          </div>
        );

      case 'Content':
        return (
          <div className="space-y-4">
            <Input
              label="Başlık"
              value={editedSlide.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Slayt başlığı..."
            />
            <RichTextEditor
              label="İçerik"
              value={editedSlide.content || ''}
              onChange={(value) => handleChange('content', value)}
              placeholder="İçeriği buraya yazın... (Markdown ve LaTeX desteklenir)"
              height={400}
            />
          </div>
        );

      case 'Image':
        return (
          <div className="space-y-4">
            <Input
              label="Başlık"
              value={editedSlide.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Slayt başlığı..."
            />
            <Input
              label="Görsel URL"
              value={editedSlide.imageUrl || ''}
              onChange={(e) => handleChange('imageUrl', e.target.value)}
              placeholder="https://..."
            />
            {editedSlide.imageUrl && (
              <div className="border rounded-lg p-2">
                <img
                  src={editedSlide.imageUrl}
                  alt="Preview"
                  className="max-h-64 mx-auto"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect fill="%23ddd"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999">Görsel yüklenemedi</text></svg>';
                  }}
                />
              </div>
            )}
            <Input
              label="Görsel Açıklaması"
              value={editedSlide.imageCaption || ''}
              onChange={(e) => handleChange('imageCaption', e.target.value)}
              placeholder="Görsel açıklaması..."
            />
          </div>
        );

      case 'TwoColumn':
        return (
          <div className="space-y-4">
            <Input
              label="Başlık"
              value={editedSlide.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Slayt başlığı..."
            />
            <div className="grid grid-cols-2 gap-4">
              <RichTextEditor
                label="Sol Sütun"
                value={editedSlide.leftColumn || ''}
                onChange={(value) => handleChange('leftColumn', value)}
                placeholder="Sol içerik..."
                height={300}
              />
              <RichTextEditor
                label="Sağ Sütun"
                value={editedSlide.rightColumn || ''}
                onChange={(value) => handleChange('rightColumn', value)}
                placeholder="Sağ içerik..."
                height={300}
              />
            </div>
          </div>
        );

      case 'Quiz':
        return (
          <div className="space-y-4">
            <Input
              label="Başlık"
              value={editedSlide.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Soru başlığı..."
            />
            <Input
              label="Soru ID (Questions Service)"
              value={editedSlide.questionId || ''}
              onChange={(e) => handleChange('questionId', e.target.value)}
              placeholder="Soru ID'sini girin..."
            />
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                💡 Soru bankasından bir soru seçmek için ID'sini girin. Soru, sunum sırasında interaktif olarak gösterilecektir.
              </p>
            </div>
          </div>
        );

      case 'Poll':
        return (
          <div className="space-y-4">
            <Input
              label="Başlık"
              value={editedSlide.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Anket başlığı..."
            />
            <Input
              label="Anket Sorusu"
              value={editedSlide.pollQuestion || ''}
              onChange={(e) => handleChange('pollQuestion', e.target.value)}
              placeholder="Anket sorusunu girin..."
            />
            <RichTextEditor
              label="Seçenekler (Her satıra bir seçenek)"
              value={editedSlide.pollOptions || ''}
              onChange={(value) => handleChange('pollOptions', value)}
              placeholder="Seçenek A\nSeçenek B\nSeçenek C"
              height={200}
            />
          </div>
        );

      default:
        return <div>Desteklenmeyen slayt tipi</div>;
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Type indicator */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="font-semibold">Tip:</span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
            {slide.type}
          </span>
        </div>

        {/* Type-specific editor */}
        {renderEditorForType()}

        {/* Advanced settings */}
        <details className="border rounded-lg">
          <summary className="cursor-pointer p-4 bg-gray-50 hover:bg-gray-100 font-semibold">
            🎨 Gelişmiş Ayarlar
          </summary>
          <div className="p-4 space-y-4">
            <Select
              label="Geçiş Efekti"
              value={editedSlide.transition}
              onChange={(e) => handleChange('transition', e.target.value)}
            >
              <option value="fade">Fade</option>
              <option value="slide">Slide</option>
              <option value="zoom">Zoom</option>
              <option value="none">None</option>
            </Select>

            <Input
              type="number"
              label="Otomatik İlerleme (saniye, 0 = kapalı)"
              value={editedSlide.duration}
              onChange={(e) => handleChange('duration', parseInt(e.target.value) || 0)}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Arka Plan Rengi"
                type="color"
                value={editedSlide.backgroundColor || '#ffffff'}
                onChange={(e) => handleChange('backgroundColor', e.target.value)}
              />
              <Input
                label="Metin Rengi"
                type="color"
                value={editedSlide.textColor || '#000000'}
                onChange={(e) => handleChange('textColor', e.target.value)}
              />
            </div>

            <RichTextEditor
              label="Konuşmacı Notları"
              value={editedSlide.speakerNotes || ''}
              onChange={(value) => handleChange('speakerNotes', value)}
              placeholder="Sadece sizin göreceğiniz notlar..."
              height={150}
            />
          </div>
        </details>
      </div>
    </div>
  );
}

