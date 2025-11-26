import { motion } from "framer-motion";

interface SlideTypeSelectorProps {
  onSelect: (type: SlideType) => void;
  onClose: () => void;
}

export type SlideType = 'Title' | 'Content' | 'Image' | 'Quiz' | 'Poll' | 'TwoColumn';

interface SlideTypeOption {
  type: SlideType;
  icon: string;
  label: string;
  description: string;
  color: string;
}

const slideTypes: SlideTypeOption[] = [
  {
    type: 'Title',
    icon: '📋',
    label: 'Başlık',
    description: 'Başlık ve alt başlık içeren kapak slaytı',
    color: 'bg-blue-500'
  },
  {
    type: 'Content',
    icon: '📝',
    label: 'İçerik',
    description: 'Metin içerikli slayt (Markdown + LaTeX)',
    color: 'bg-green-500'
  },
  {
    type: 'Image',
    icon: '🖼️',
    label: 'Görsel',
    description: 'Görsel ve açıklama içeren slayt',
    color: 'bg-purple-500'
  },
  {
    type: 'TwoColumn',
    icon: '⚖️',
    label: 'İki Sütun',
    description: 'Yan yana iki sütunlu içerik',
    color: 'bg-orange-500'
  },
  {
    type: 'Quiz',
    icon: '❓',
    label: 'Soru',
    description: 'Soru bankasından soru ekle',
    color: 'bg-red-500'
  },
  {
    type: 'Poll',
    icon: '📊',
    label: 'Anket',
    description: 'Anlık oylama ve görüş alma',
    color: 'bg-pink-500'
  }
];

export default function SlideTypeSelector({ onSelect, onClose }: SlideTypeSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Slayt Tipi Seçin</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {slideTypes.map((slideType) => (
            <motion.button
              key={slideType.type}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onSelect(slideType.type);
                onClose();
              }}
              className="text-left p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all group"
            >
              <div className="flex items-start gap-3">
                <div className={`${slideType.color} text-white text-3xl p-3 rounded-lg`}>
                  {slideType.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600">
                    {slideType.label}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {slideType.description}
                  </p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

