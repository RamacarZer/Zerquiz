// Lesson Templates Page - Browse and use pedagogical templates

import { useLanguage } from '../../hooks/useLanguage';
import { 
  BookOpen, Layers, Users, Target, Search, 
  Lightbulb, Puzzle, MessageCircle, Wrench 
} from 'lucide-react';

interface Template {
  id: string;
  code: string;
  name: string;
  description: string;
  duration: string;
  bestFor: string[];
  phases: { name: string; duration: string }[];
  color: string;
  icon: any;
}

const templates: Template[] = [
  {
    id: '1',
    code: '5e_model',
    name: '5E Model',
    description: 'A constructivist teaching approach with 5 phases: Engage, Explore, Explain, Elaborate, and Evaluate.',
    duration: '60-90 min',
    bestFor: ['Science', 'STEM', 'Discovery Learning'],
    phases: [
      { name: 'Engage', duration: '10 min' },
      { name: 'Explore', duration: '20 min' },
      { name: 'Explain', duration: '15 min' },
      { name: 'Elaborate', duration: '20 min' },
      { name: 'Evaluate', duration: '10 min' },
    ],
    color: 'from-pink-500 to-purple-500',
    icon: Layers,
  },
  {
    id: '2',
    code: 'project_based',
    name: 'Project-Based Learning',
    description: 'Students learn by actively engaging in real-world and personally meaningful projects.',
    duration: '2-4 weeks',
    bestFor: ['Problem Solving', 'Collaboration', 'Real-world Skills'],
    phases: [
      { name: 'Problem Introduction', duration: '1 class' },
      { name: 'Research & Planning', duration: '2-3 classes' },
      { name: 'Design & Development', duration: '4-6 classes' },
      { name: 'Presentation', duration: '1-2 classes' },
      { name: 'Reflection', duration: '1 class' },
    ],
    color: 'from-blue-500 to-teal-500',
    icon: Target,
  },
  {
    id: '3',
    code: 'flipped_classroom',
    name: 'Flipped Classroom',
    description: 'Students learn content at home and apply knowledge through active learning in class.',
    duration: '45-60 min',
    bestFor: ['Active Learning', 'Technology Integration', 'Self-paced'],
    phases: [
      { name: 'Pre-class (Video/Reading)', duration: 'At home' },
      { name: 'In-class (Active Learning)', duration: '40 min' },
      { name: 'Post-class (Practice)', duration: 'Homework' },
    ],
    color: 'from-green-500 to-lime-500',
    icon: BookOpen,
  },
  {
    id: '4',
    code: 'traditional',
    name: 'Direct Instruction',
    description: 'Teacher-centered approach with clear explanation and guided practice.',
    duration: '45-60 min',
    bestFor: ['New Concepts', 'Skill Building', 'Clear Objectives'],
    phases: [
      { name: 'Warm-up/Review', duration: '5 min' },
      { name: 'Present New Material', duration: '20 min' },
      { name: 'Guided Practice', duration: '10 min' },
      { name: 'Independent Practice', duration: '10 min' },
      { name: 'Closure & Assessment', duration: '5 min' },
    ],
    color: 'from-orange-500 to-yellow-500',
    icon: BookOpen,
  },
  {
    id: '5',
    code: 'inquiry_based',
    name: 'Inquiry-Based Learning',
    description: 'Students construct knowledge through asking questions and investigating.',
    duration: '60-90 min',
    bestFor: ['Critical Thinking', 'Research Skills', 'Curiosity'],
    phases: [
      { name: 'Question Formation', duration: '15 min' },
      { name: 'Investigation', duration: '30 min' },
      { name: 'Analysis', duration: '20 min' },
      { name: 'Conclusion', duration: '10 min' },
    ],
    color: 'from-purple-500 to-indigo-500',
    icon: Lightbulb,
  },
  {
    id: '6',
    code: 'jigsaw',
    name: 'Jigsaw Cooperative Learning',
    description: 'Students become experts on one part and teach others in a structured group activity.',
    duration: '60-75 min',
    bestFor: ['Collaboration', 'Peer Teaching', 'Complex Topics'],
    phases: [
      { name: 'Home Groups Formation', duration: '5 min' },
      { name: 'Expert Groups Study', duration: '20 min' },
      { name: 'Return to Home Groups', duration: '25 min' },
      { name: 'Assessment', duration: '10 min' },
    ],
    color: 'from-teal-500 to-cyan-500',
    icon: Puzzle,
  },
  {
    id: '7',
    code: 'socratic',
    name: 'Socratic Seminar',
    description: 'Dialogue-based learning where students ask and answer questions to explore ideas.',
    duration: '45-60 min',
    bestFor: ['Critical Thinking', 'Communication', 'Philosophy'],
    phases: [
      { name: 'Pre-reading', duration: 'Homework' },
      { name: 'Opening Question', duration: '5 min' },
      { name: 'Discussion', duration: '30 min' },
      { name: 'Reflection', duration: '10 min' },
    ],
    color: 'from-pink-500 to-red-500',
    icon: MessageCircle,
  },
  {
    id: '8',
    code: 'problem_solving',
    name: 'Problem-Solving Workshop',
    description: 'Hands-on approach where students work through real problems with guidance.',
    duration: '60-90 min',
    bestFor: ['Mathematics', 'Engineering', 'Practical Skills'],
    phases: [
      { name: 'Problem Presentation', duration: '10 min' },
      { name: 'Independent Attempt', duration: '15 min' },
      { name: 'Group Discussion', duration: '20 min' },
      { name: 'Solution Review', duration: '15 min' },
    ],
    color: 'from-green-500 to-emerald-500',
    icon: Wrench,
  },
];

export default function LessonTemplatesPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-3 mb-3">
          <BookOpen className="w-8 h-8" />
          <h1 className="text-3xl font-bold">{t('lesson_templates')}</h1>
        </div>
        <p className="text-purple-100 text-lg">
          8 research-based pedagogical templates to create effective lessons
        </p>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-100 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search templates..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all group"
          >
            {/* Header with Gradient */}
            <div className={`bg-gradient-to-r ${template.color} p-6 text-white`}>
              <div className="flex items-start justify-between mb-3">
                <div className="bg-white/20 backdrop-blur p-3 rounded-lg">
                  <template.icon className="w-6 h-6" />
                </div>
                <button className="px-4 py-2 bg-white/20 backdrop-blur hover:bg-white/30 rounded-lg font-semibold transition-colors">
                  Use Template
                </button>
              </div>
              <h3 className="text-2xl font-bold mb-2">{template.name}</h3>
              <p className="text-sm opacity-90">{template.description}</p>
            </div>

            {/* Body */}
            <div className="p-6">
              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">Duration</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    {template.duration}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Layers className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">Phases</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    {template.phases.length} Steps
                  </p>
                </div>
              </div>

              {/* Best For */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Best For:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {template.bestFor.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 text-xs rounded-full"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Phases */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Lesson Phases:
                </h4>
                <div className="space-y-2">
                  {template.phases.map((phase, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center text-xs font-bold">
                          {idx + 1}
                        </div>
                        <span className="text-sm font-medium text-gray-800 dark:text-white">
                          {phase.name}
                        </span>
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {phase.duration}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
              <button className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all">
                Create Lesson with This Template
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Info Section */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
          💡 How to Use Templates
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• <strong>Choose a template</strong> that fits your learning objectives and subject</li>
          <li>• <strong>Customize phases</strong> by adding your own activities and resources</li>
          <li>• <strong>Set duration</strong> based on your class schedule</li>
          <li>• <strong>Add materials</strong> from your content library or create new ones</li>
          <li>• <strong>Preview and publish</strong> when ready to use with students</li>
        </ul>
      </div>
    </div>
  );
}
