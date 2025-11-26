import { Slide } from "../../services/api/presentationService";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SlideThumbnailProps {
  slide: Slide;
  index: number;
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
}

export default function SlideThumbnail({
  slide,
  index,
  isActive,
  onClick,
  onDelete,
}: SlideThumbnailProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: slide.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getSlideIcon = () => {
    switch (slide.type) {
      case 'Title': return '📋';
      case 'Content': return '📝';
      case 'Image': return '🖼️';
      case 'TwoColumn': return '⚖️';
      case 'Quiz': return '❓';
      case 'Poll': return '📊';
      default: return '📄';
    }
  };

  const getSlidePreview = () => {
    switch (slide.type) {
      case 'Title':
        return (
          <div className="text-center">
            <div className="font-bold text-xs mb-1">{slide.title || 'Başlık'}</div>
            <div className="text-xs opacity-70">{slide.content?.substring(0, 20) || ''}</div>
          </div>
        );
      case 'Content':
        return (
          <div>
            <div className="font-semibold text-xs mb-1">{slide.title || 'İçerik'}</div>
            <div className="text-xs opacity-70 line-clamp-2">{slide.content?.substring(0, 40) || ''}</div>
          </div>
        );
      case 'Image':
        return (
          <div>
            <div className="font-semibold text-xs mb-1">{slide.title || 'Görsel'}</div>
            {slide.imageUrl ? (
              <div className="mt-1 bg-gray-200 rounded h-12 flex items-center justify-center overflow-hidden">
                <img src={slide.imageUrl} alt="" className="max-h-full" />
              </div>
            ) : (
              <div className="mt-1 bg-gray-200 rounded h-12 flex items-center justify-center text-gray-400 text-xs">
                Görsel yok
              </div>
            )}
          </div>
        );
      case 'TwoColumn':
        return (
          <div>
            <div className="font-semibold text-xs mb-1">{slide.title || 'İki Sütun'}</div>
            <div className="grid grid-cols-2 gap-1 text-xs opacity-70">
              <div className="truncate">{slide.leftColumn?.substring(0, 15) || 'Sol'}</div>
              <div className="truncate">{slide.rightColumn?.substring(0, 15) || 'Sağ'}</div>
            </div>
          </div>
        );
      case 'Quiz':
        return (
          <div className="text-center">
            <div className="text-2xl mb-1">❓</div>
            <div className="text-xs font-semibold">{slide.title || 'Soru'}</div>
          </div>
        );
      case 'Poll':
        return (
          <div className="text-center">
            <div className="text-2xl mb-1">📊</div>
            <div className="text-xs font-semibold">{slide.pollQuestion || 'Anket'}</div>
          </div>
        );
      default:
        return <div className="text-xs">Slayt #{index + 1}</div>;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group cursor-pointer border-2 rounded-lg p-3 transition-all ${
        isActive
          ? 'border-blue-500 bg-blue-50 shadow-md'
          : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
      }`}
      onClick={onClick}
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-1 left-1 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded px-1 text-gray-400"
      >
        ⋮⋮
      </div>

      {/* Slide number */}
      <div className="absolute top-1 right-1 bg-gray-800 text-white text-xs px-2 py-0.5 rounded">
        {index + 1}
      </div>

      {/* Type icon */}
      <div className="text-2xl mb-2">{getSlideIcon()}</div>

      {/* Preview */}
      <div className="text-left">{getSlidePreview()}</div>

      {/* Delete button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600"
      >
        🗑️
      </button>
    </div>
  );
}

