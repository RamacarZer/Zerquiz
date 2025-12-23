import { CheckCircle } from 'lucide-react';

interface ExamWizardStepsProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

const steps = [
  { id: 1, title: 'Sınav Bilgileri', description: 'Temel ayarlar' },
  { id: 2, title: 'Sorular', description: 'Soru seçimi' },
  { id: 3, title: 'Ayarlar', description: 'Süre ve kurallar' },
  { id: 4, title: 'Önizleme', description: 'Son kontrol' },
];

export default function ExamWizardSteps({ currentStep, onStepClick }: ExamWizardStepsProps) {
  return (
    <ul className="steps steps-vertical lg:steps-horizontal w-full mb-8">
      {steps.map((step) => (
        <li
          key={step.id}
          className={`step ${currentStep >= step.id ? 'step-primary' : ''} cursor-pointer`}
          onClick={() => onStepClick(step.id)}
        >
          <div className="text-left ml-4">
            <div className="font-semibold">{step.title}</div>
            <div className="text-xs text-gray-500">{step.description}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}

