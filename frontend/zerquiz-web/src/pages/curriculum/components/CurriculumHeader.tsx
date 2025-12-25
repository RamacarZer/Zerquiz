interface CurriculumHeaderProps {
  title: string;
  description: string;
}

export default function CurriculumHeader({ title, description }: CurriculumHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
      <p className="text-gray-600 mt-2">{description}</p>
    </div>
  );
}


