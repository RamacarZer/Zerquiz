import { Slide } from "../../services/api/presentationService";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

interface SlideRendererProps {
  slide: Slide;
  theme?: string;
}

export default function SlideRenderer({ slide, theme = "default" }: SlideRendererProps) {
  const getThemeStyles = () => {
    switch (theme) {
      case "dark":
        return {
          background: slide.backgroundColor || "#1a1a1a",
          color: slide.textColor || "#ffffff",
        };
      case "minimal":
        return {
          background: slide.backgroundColor || "#f8f9fa",
          color: slide.textColor || "#212529",
        };
      default:
        return {
          background: slide.backgroundColor || "#ffffff",
          color: slide.textColor || "#000000",
        };
    }
  };

  const themeStyles = getThemeStyles();

  const renderSlideContent = () => {
    switch (slide.type) {
      case "Title":
        return (
          <div className="flex flex-col items-center justify-center h-full text-center px-12">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-6xl font-bold mb-6"
            >
              {slide.title || "Başlık"}
            </motion.h1>
            {slide.content && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-2xl opacity-80"
              >
                <ReactMarkdown
                  remarkPlugins={[remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                >
                  {slide.content}
                </ReactMarkdown>
              </motion.div>
            )}
          </div>
        );

      case "Content":
        return (
          <div className="flex flex-col h-full p-12">
            {slide.title && (
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl font-bold mb-6"
              >
                {slide.title}
              </motion.h2>
            )}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="prose prose-lg max-w-none flex-1 overflow-y-auto"
            >
              <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
              >
                {slide.content || ""}
              </ReactMarkdown>
            </motion.div>
          </div>
        );

      case "Image":
        return (
          <div className="flex flex-col h-full p-12">
            {slide.title && (
              <h2 className="text-4xl font-bold mb-6 text-center">{slide.title}</h2>
            )}
            <div className="flex-1 flex items-center justify-center">
              {slide.imageUrl ? (
                <motion.img
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  src={slide.imageUrl}
                  alt={slide.imageCaption || ""}
                  className="max-h-full max-w-full object-contain rounded-lg shadow-lg"
                />
              ) : (
                <div className="text-gray-400 text-xl">Görsel yüklenmedi</div>
              )}
            </div>
            {slide.imageCaption && (
              <p className="text-center text-xl mt-4 opacity-80">
                {slide.imageCaption}
              </p>
            )}
          </div>
        );

      case "TwoColumn":
        return (
          <div className="flex flex-col h-full p-12">
            {slide.title && (
              <h2 className="text-4xl font-bold mb-6 text-center">{slide.title}</h2>
            )}
            <div className="flex-1 grid grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="prose prose-lg max-w-none overflow-y-auto"
              >
                <ReactMarkdown
                  remarkPlugins={[remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                >
                  {slide.leftColumn || ""}
                </ReactMarkdown>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="prose prose-lg max-w-none overflow-y-auto border-l-2 border-gray-300 pl-8"
              >
                <ReactMarkdown
                  remarkPlugins={[remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                >
                  {slide.rightColumn || ""}
                </ReactMarkdown>
              </motion.div>
            </div>
          </div>
        );

      case "Quiz":
        return (
          <div className="flex flex-col items-center justify-center h-full p-12 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-8xl mb-6"
            >
              ❓
            </motion.div>
            <h2 className="text-4xl font-bold mb-4">{slide.title || "Soru Zamanı!"}</h2>
            <p className="text-xl opacity-80 mb-8">
              Soru ID: {slide.questionId || "Belirtilmemiş"}
            </p>
            <div className="bg-yellow-100 text-yellow-800 px-6 py-3 rounded-lg">
              💡 Canlı modda öğrenciler bu soruya cevap verebilecek
            </div>
          </div>
        );

      case "Poll":
        return (
          <div className="flex flex-col h-full p-12">
            {slide.title && (
              <h2 className="text-4xl font-bold mb-6 text-center">{slide.title}</h2>
            )}
            <div className="flex-1 flex flex-col items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-6xl mb-6"
              >
                📊
              </motion.div>
              <h3 className="text-3xl font-semibold mb-8 text-center">
                {slide.pollQuestion || "Anket sorusu"}
              </h3>
              {slide.pollOptions && (
                <div className="space-y-4 w-full max-w-2xl">
                  {slide.pollOptions.split("\n").map((option, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white bg-opacity-20 backdrop-blur-sm border-2 border-current rounded-lg p-4 text-xl"
                    >
                      <span className="font-bold mr-3">{String.fromCharCode(65 + index)}.</span>
                      {option}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-full">
            <p className="text-xl opacity-60">Desteklenmeyen slayt tipi: {slide.type}</p>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={themeStyles}
      className="w-full h-full"
    >
      {renderSlideContent()}
    </motion.div>
  );
}

