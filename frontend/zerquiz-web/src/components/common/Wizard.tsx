import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface WizardStepProps {
  number: number;
  title: string;
  isActive: boolean;
  isCompleted: boolean;
  onClick?: () => void;
}

const WizardStep: React.FC<WizardStepProps> = ({ number, title, isActive, isCompleted, onClick }) => {
  return (
    <div
      className={`flex items-center cursor-pointer ${isActive || isCompleted ? '' : 'opacity-50'}`}
      onClick={onClick}
    >
      <div
        className={`
          w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all
          ${
            isActive
              ? 'bg-blue-600 text-white shadow-lg scale-110'
              : isCompleted
              ? 'bg-green-600 text-white'
              : 'bg-gray-300 text-gray-600'
          }
        `}
      >
        {isCompleted ? '✓' : number}
      </div>
      <span
        className={`ml-3 text-sm font-medium ${
          isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
        }`}
      >
        {title}
      </span>
    </div>
  );
};

interface WizardProps {
  steps: string[];
  currentStep: number;
  onStepChange?: (step: number) => void;
  children: React.ReactNode;
  onNext?: () => void | Promise<void>;
  onPrevious?: () => void;
  onClose?: () => void;
  onFinish?: () => void | Promise<void>;
  title?: string;
  showStepIndicator?: boolean;
  isLoading?: boolean;
  nextButtonText?: string;
  finishButtonText?: string;
  showFooter?: boolean;
  variant?: 'modal' | 'inline';
}

export const Wizard: React.FC<WizardProps> = ({
  steps,
  currentStep,
  onStepChange,
  children,
  onNext,
  onPrevious,
  onClose,
  onFinish,
  title,
  showStepIndicator = true,
  isLoading = false,
  nextButtonText = 'Sonraki',
  finishButtonText = 'Tamamla',
  showFooter = true,
  variant = 'modal',
}) => {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = async () => {
    if (isLastStep && onFinish) {
      await onFinish();
    } else if (onNext) {
      await onNext();
    }
  };

  const stepIndicator = (
    <div
      className={`${
        variant === 'modal' ? 'px-8 py-6' : 'px-6 py-4'
      } border-b border-gray-200 bg-gray-50`}
    >
      <div className="flex items-center justify-between flex-wrap gap-4">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center gap-3">
            <div
              className={`${
                variant === 'modal' ? 'w-10 h-10' : 'w-8 h-8'
              } rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                index === currentStep
                  ? 'bg-blue-600 text-white shadow-lg'
                  : index < currentStep
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}
            >
              {index < currentStep ? '✓' : index + 1}
            </div>
            <span
              className={`text-sm font-medium ${
                index === currentStep ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const contentArea = (
    <div className={`${variant === 'modal' ? 'flex-1 overflow-y-auto px-8 py-6' : 'px-6 py-6'}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );

  const footer = showFooter ? (
    <div
      className={`${
        variant === 'modal' ? 'px-8 py-6' : 'px-6 py-4'
      } border-t border-gray-200 bg-gray-50 flex items-center justify-between`}
    >
      <button
        onClick={onPrevious}
        disabled={isFirstStep || isLoading}
        className={`
          px-6 py-2.5 rounded-lg font-medium transition
          ${
            isFirstStep || isLoading
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }
        `}
      >
        Geri
      </button>

      <div className="flex items-center gap-3">
        {onClose && !isLastStep && variant === 'modal' && (
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition"
          >
            İptal
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={isLoading}
          className={`
            px-8 py-2.5 rounded-lg font-medium transition shadow-md
            ${
              isLoading
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
            }
          `}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>İşleniyor...</span>
            </div>
          ) : isLastStep ? (
            finishButtonText
          ) : (
            nextButtonText
          )}
        </button>
      </div>
    </div>
  ) : null;

  if (variant === 'inline') {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xl">
        {showStepIndicator && stepIndicator}
        {contentArea}
        {footer}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            {title && <h2 className="text-2xl font-bold text-gray-900">{title}</h2>}
            {showStepIndicator && (
              <p className="text-sm text-gray-500 mt-1">
                Adım {currentStep + 1} / {steps.length}
              </p>
            )}
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              aria-label="Kapat"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          )}
        </div>

        {/* Steps Indicator */}
        {stepIndicator}

        {/* Content */}
        {contentArea}

        {/* Footer */}
        {footer}
      </motion.div>
    </div>
  );
};

export default Wizard;

