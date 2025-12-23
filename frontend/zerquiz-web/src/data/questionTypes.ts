// 65 Comprehensive Question Type Definitions
export interface QuestionType {
  id: number;
  code: string;
  name: string;
  nameTR: string;
  category: 'classic' | 'modern' | 'interactive' | 'multimedia' | 'advanced' | 'performance';
  hasTemplate: boolean;
  icon: string;
  description: string;
  answerType: string;
  requiresOptions: boolean;
  supportsMultipleAnswers: boolean;
  minOptions?: number;
  maxOptions?: number;
  estimatedTime?: number; // in seconds
  bloomLevel?: string[];
  displayOrder: number;
}

export const QUESTION_TYPES: QuestionType[] = [
  // === CLASSIC TYPES (1-10) ===
  { id: 1, code: 'multiple_choice_single', name: 'Multiple Choice (Single)', nameTR: 'Çoktan Seçmeli (Tek Cevap)', category: 'classic', hasTemplate: true, icon: '✓', description: 'Klasik çoktan seçmeli soru', answerType: 'options', requiresOptions: true, supportsMultipleAnswers: false, minOptions: 2, maxOptions: 5, estimatedTime: 60, bloomLevel: ['Knowledge', 'Comprehension'], displayOrder: 1 },
  { id: 2, code: 'multiple_choice_multiple', name: 'Multiple Choice (Multiple)', nameTR: 'Çoktan Seçmeli (Çoklu Cevap)', category: 'classic', hasTemplate: true, icon: '☑', description: 'Birden fazla doğru cevap', answerType: 'options', requiresOptions: true, supportsMultipleAnswers: true, minOptions: 2, maxOptions: 8, estimatedTime: 90, bloomLevel: ['Comprehension', 'Analysis'], displayOrder: 2 },
  { id: 3, code: 'true_false', name: 'True/False', nameTR: 'Doğru/Yanlış', category: 'classic', hasTemplate: true, icon: '✗', description: 'İki şıklı soru', answerType: 'boolean', requiresOptions: false, supportsMultipleAnswers: false, estimatedTime: 30, bloomLevel: ['Knowledge'], displayOrder: 3 },
  { id: 4, code: 'short_answer', name: 'Short Answer', nameTR: 'Kısa Yanıt', category: 'classic', hasTemplate: true, icon: '✍', description: 'Kısa metin cevabı', answerType: 'text_input', requiresOptions: false, supportsMultipleAnswers: false, estimatedTime: 120, bloomLevel: ['Knowledge', 'Comprehension'], displayOrder: 4 },
  { id: 5, code: 'essay', name: 'Essay', nameTR: 'Uzun Yanıt / Kompozisyon', category: 'classic', hasTemplate: true, icon: '📝', description: 'Detaylı açıklama gerektiren sorular', answerType: 'text_input', requiresOptions: false, supportsMultipleAnswers: false, estimatedTime: 600, bloomLevel: ['Analysis', 'Synthesis', 'Evaluation'], displayOrder: 5 },
  { id: 6, code: 'fill_blank', name: 'Fill in the Blank', nameTR: 'Boşluk Doldurma', category: 'classic', hasTemplate: true, icon: '___', description: 'Metindeki boşlukları tamamlama', answerType: 'text_input', requiresOptions: false, supportsMultipleAnswers: false, estimatedTime: 90, bloomLevel: ['Knowledge', 'Application'], displayOrder: 6 },
  { id: 7, code: 'open_ended', name: 'Open Ended', nameTR: 'Açık Uçlu', category: 'classic', hasTemplate: true, icon: '💭', description: 'Açık uçlu soru', answerType: 'text_input', requiresOptions: false, supportsMultipleAnswers: false, estimatedTime: 300, bloomLevel: ['Analysis', 'Synthesis'], displayOrder: 7 },
  { id: 8, code: 'numeric_input', name: 'Numeric Input', nameTR: 'Sayısal Giriş', category: 'classic', hasTemplate: true, icon: '🔢', description: 'Sayısal cevap gerektiren soru', answerType: 'number', requiresOptions: false, supportsMultipleAnswers: false, estimatedTime: 90, bloomLevel: ['Application'], displayOrder: 8 },
  { id: 9, code: 'ordering_sequence', name: 'Ordering/Sequencing', nameTR: 'Sıralama', category: 'classic', hasTemplate: true, icon: '↕', description: 'Öğeleri doğru sıraya dizme', answerType: 'ordering', requiresOptions: true, supportsMultipleAnswers: false, minOptions: 3, maxOptions: 8, estimatedTime: 120, bloomLevel: ['Comprehension', 'Analysis'], displayOrder: 9 },
  { id: 10, code: 'matching_pairs', name: 'Matching Pairs', nameTR: 'Eşleştirme', category: 'classic', hasTemplate: true, icon: '⇄', description: 'İki liste arasındaki öğeleri eşleştirme', answerType: 'matching', requiresOptions: true, supportsMultipleAnswers: false, minOptions: 3, maxOptions: 10, estimatedTime: 150, bloomLevel: ['Comprehension', 'Application'], displayOrder: 10 },

  // === MODERN TYPES (11-20) ===
  { id: 11, code: 'table_matching', name: 'Table Matching', nameTR: 'Tablo Eşleştirme', category: 'modern', hasTemplate: true, icon: '📊', description: 'Tablo içinde eşleştirme yapma', answerType: 'table_matching', requiresOptions: true, supportsMultipleAnswers: false, estimatedTime: 180, bloomLevel: ['Analysis'], displayOrder: 11 },
  { id: 12, code: 'matrix_type', name: 'Matrix Type', nameTR: 'Matrix / Kıyaslama Tablosu', category: 'modern', hasTemplate: true, icon: '⊞', description: 'Çok boyutlu kıyaslama tablosu', answerType: 'matrix', requiresOptions: false, supportsMultipleAnswers: false, estimatedTime: 240, bloomLevel: ['Analysis', 'Synthesis'], displayOrder: 12 },
  { id: 13, code: 'drag_drop_text', name: 'Drag & Drop (Text)', nameTR: 'Sürükle Bırak (Metin)', category: 'modern', hasTemplate: true, icon: '↔', description: 'Metin öğelerini sürükleyip doğru yere bırakma', answerType: 'drag_drop', requiresOptions: true, supportsMultipleAnswers: false, minOptions: 3, maxOptions: 10, estimatedTime: 120, bloomLevel: ['Application'], displayOrder: 13 },
  { id: 14, code: 'drag_drop_image', name: 'Drag & Drop (Image)', nameTR: 'Sürükle Bırak (Görsel)', category: 'modern', hasTemplate: true, icon: '🖼↔', description: 'Görsel öğeleri sürükleyip yerleştirme', answerType: 'drag_drop', requiresOptions: true, supportsMultipleAnswers: false, minOptions: 2, maxOptions: 8, estimatedTime: 150, bloomLevel: ['Application', 'Analysis'], displayOrder: 14 },
  { id: 15, code: 'hotspot', name: 'Hotspot (Single)', nameTR: 'Hotspot (Tek Nokta)', category: 'modern', hasTemplate: true, icon: '📍', description: 'Görsel üzerinde tek nokta işaretleme', answerType: 'hotspot', requiresOptions: false, supportsMultipleAnswers: false, estimatedTime: 90, bloomLevel: ['Knowledge', 'Application'], displayOrder: 15 },
  { id: 16, code: 'multi_hotspot', name: 'Multi-Hotspot', nameTR: 'Çoklu Hotspot', category: 'modern', hasTemplate: true, icon: '📍📍', description: 'Görsel üzerinde birden fazla nokta işaretleme', answerType: 'multi_hotspot', requiresOptions: false, supportsMultipleAnswers: true, estimatedTime: 120, bloomLevel: ['Application', 'Analysis'], displayOrder: 16 },
  { id: 17, code: 'image_labeling', name: 'Image Labeling', nameTR: 'Görsel Etiketleme', category: 'modern', hasTemplate: true, icon: '🏷', description: 'Görsel üzerindeki bölümleri etiketleme', answerType: 'labeling', requiresOptions: true, supportsMultipleAnswers: false, estimatedTime: 180, bloomLevel: ['Knowledge', 'Comprehension'], displayOrder: 17 },
  { id: 18, code: 'map_point_select', name: 'Map Point Selection', nameTR: 'Harita Nokta Seçimi', category: 'modern', hasTemplate: true, icon: '🗺', description: 'Harita üzerinde konum işaretleme', answerType: 'map_selection', requiresOptions: false, supportsMultipleAnswers: false, estimatedTime: 120, bloomLevel: ['Knowledge', 'Application'], displayOrder: 18 },
  { id: 19, code: 'area_selection', name: 'Area Selection', nameTR: 'Alan Seçimi', category: 'modern', hasTemplate: true, icon: '▭', description: 'Görsel üzerinde alan belirleme', answerType: 'area_selection', requiresOptions: false, supportsMultipleAnswers: false, estimatedTime: 150, bloomLevel: ['Application'], displayOrder: 19 },
  { id: 20, code: 'simulation_based', name: 'Simulation Based', nameTR: 'Simülasyon Tabanlı', category: 'modern', hasTemplate: true, icon: '🎮', description: 'İnteraktif simülasyon sorusu', answerType: 'simulation', requiresOptions: false, supportsMultipleAnswers: false, estimatedTime: 300, bloomLevel: ['Application', 'Analysis', 'Synthesis'], displayOrder: 20 },

  // === INTERACTIVE TYPES (21-30) ===
  { id: 21, code: '3d_model_marking', name: '3D Model Marking', nameTR: '3D Model İşaretleme', category: 'interactive', hasTemplate: true, icon: '🎨', description: '3D model üzerinde işaretleme yapma', answerType: '3d_marking', requiresOptions: false, supportsMultipleAnswers: false, estimatedTime: 240, bloomLevel: ['Application', 'Analysis'], displayOrder: 21 },
  { id: 22, code: 'sorting_categories', name: 'Sorting into Categories', nameTR: 'Kategorilere Ayırma', category: 'interactive', hasTemplate: true, icon: '📂', description: 'Öğeleri kategorilere ayırma', answerType: 'sorting', requiresOptions: true, supportsMultipleAnswers: false, minOptions: 2, maxOptions: 6, estimatedTime: 180, bloomLevel: ['Comprehension', 'Analysis'], displayOrder: 22 },
  { id: 23, code: 'video_prompt', name: 'Video Prompt', nameTR: 'Video Sorulu', category: 'interactive', hasTemplate: true, icon: '🎥', description: 'Video izlettikten sonra soru', answerType: 'video_question', requiresOptions: false, supportsMultipleAnswers: false, estimatedTime: 300, bloomLevel: ['Comprehension', 'Analysis'], displayOrder: 23 },
  { id: 24, code: 'audio_response', name: 'Audio Response', nameTR: 'Sesli Yanıt', category: 'interactive', hasTemplate: true, icon: '🎙', description: 'Sesli cevap kaydı', answerType: 'audio', requiresOptions: false, supportsMultipleAnswers: false, estimatedTime: 180, bloomLevel: ['Application', 'Synthesis'], displayOrder: 24 },
  { id: 25, code: 'speech_oral_exam', name: 'Speech/Oral Exam', nameTR: 'Sözlü Sınav', category: 'interactive', hasTemplate: true, icon: '🗣', description: 'Sözlü değerlendirme sorusu', answerType: 'speech', requiresOptions: false, supportsMultipleAnswers: false, estimatedTime: 600, bloomLevel: ['Synthesis', 'Evaluation'], displayOrder: 25 },
  { id: 26, code: 'image_prompt', name: 'Image Prompt', nameTR: 'Görsel Sorulu', category: 'interactive', hasTemplate: true, icon: '🖼', description: 'Görsel tabanlı soru', answerType: 'image_question', requiresOptions: false, supportsMultipleAnswers: false, estimatedTime: 120, bloomLevel: ['Comprehension', 'Analysis'], displayOrder: 26 },
  { id: 27, code: 'gif_animation', name: 'GIF/Animation', nameTR: 'GIF/Animasyon Sorulu', category: 'interactive', hasTemplate: true, icon: '🎞', description: 'Animasyon tabanlı soru', answerType: 'animation_question', requiresOptions: false, supportsMultipleAnswers: false, estimatedTime: 150, bloomLevel: ['Comprehension', 'Analysis'], displayOrder: 27 },
  { id: 28, code: 'pdf_document', name: 'PDF Document', nameTR: 'PDF Belge Sorulu', category: 'interactive', hasTemplate: true, icon: '📄', description: 'PDF belgesi üzerinden soru', answerType: 'document_question', requiresOptions: false, supportsMultipleAnswers: false, estimatedTime: 300, bloomLevel: ['Comprehension', 'Analysis'], displayOrder: 28 },
  { id: 29, code: 'chart_graph', name: 'Chart/Graph', nameTR: 'Grafik/Tablo Sorulu', category: 'interactive', hasTemplate: true, icon: '📈', description: 'Grafik/tablo yorumlama', answerType: 'chart_question', requiresOptions: false, supportsMultipleAnswers: false, estimatedTime: 180, bloomLevel: ['Analysis'], displayOrder: 29 },
  { id: 30, code: 'table_data', name: 'Table Data', nameTR: 'Tablo Verisi Sorulu', category: 'interactive', hasTemplate: true, icon: '📊', description: 'Tablo verisi yorumlama', answerType: 'table_question', requiresOptions: false, supportsMultipleAnswers: false, estimatedTime: 180, bloomLevel: ['Analysis'], displayOrder: 30 },

  // === MULTIMEDIA TYPES (31-40) ===
  { id: 31, code: 'code_execution', name: 'Code Execution', nameTR: 'Kod Çalıştırma', category: 'multimedia', hasTemplate: true, icon: '💻', description: 'Kod yazma ve çalıştırma sorusu', answerType: 'code', requiresOptions: false, supportsMultipleAnswers: false, estimatedTime: 600, bloomLevel: ['Application', 'Synthesis'], displayOrder: 31 },
  { id: 32, code: 'code_debugging', name: 'Code Debugging', nameTR: 'Kod Hata Bulma', category: 'multimedia', hasTemplate: false, icon: '🐛', description: 'Kodda hata bulma ve düzeltme', answerType: 'code_fix', requiresOptions: false, supportsMultipleAnswers: false, estimatedTime: 480, bloomLevel: ['Analysis', 'Synthesis'], displayOrder: 32 },
  { id: 33, code: 'code_completion', name: 'Code Completion', nameTR: 'Kod Tamamlama', category: 'multimedia', hasTemplate: false, icon: '⌨', description: 'Eksik kodu tamamlama', answerType: 'code_complete', requiresOptions: false, supportsMultipleAnswers: false, estimatedTime: 360, bloomLevel: ['Application'], displayOrder: 33 },
  { id: 34, code: 'sql_query', name: 'SQL Query', nameTR: 'SQL Sorgusu', category: 'multimedia', hasTemplate: false, icon: '🗄', description: 'SQL sorgusu yazma', answerType: 'sql', requiresOptions: false, supportsMultipleAnswers: false, estimatedTime: 300, bloomLevel: ['Application', 'Analysis'], displayOrder: 34 },
  { id: 35, code: 'formula_input', name: 'Formula Input', nameTR: 'Formül Girişi', category: 'multimedia', hasTemplate: false, icon: '∑', description: 'Matematiksel formül yazma', answerType: 'formula', requiresOptions: false, supportsMultipleAnswers: false, estimatedTime: 180, bloomLevel: ['Application'], displayOrder: 35 },
  { id: 36, code: 'chemical_equation', name: 'Chemical Equation', nameTR: 'Kimyasal Denklem', category: 'multimedia', hasTemplate: false, icon: '⚗', description: 'Kimya denklemi yazma', answerType: 'chemical', requiresOptions: false, supportsMultipleAnswers: false, estimatedTime: 240, bloomLevel: ['Application', 'Analysis'], displayOrder: 36 },
  { id: 37, code: 'music_notation', name: 'Music Notation', nameTR: 'Müzik Notasyonu', category: 'multimedia', hasTemplate: false, icon: '🎵', description: 'Nota yazma/okuma sorusu', answerType: 'music', requiresOptions: false, supportsMultipleAnswers: false, estimatedTime: 240, bloomLevel: ['Knowledge', 'Application'], displayOrder: 37 },
  { id: 38, code: 'drawing_sketch', name: 'Drawing/Sketch', nameTR: 'Çizim/Eskiz', category: 'multimedia', hasTemplate: false, icon: '✏', description: 'Serbest çizim yapma', answerType: 'drawing', requiresOptions: false, supportsMultipleAnswers: false, estimatedTime: 360, bloomLevel: ['Application', 'Synthesis'], displayOrder: 38 },
  { id: 39, code: 'handwriting_recognition', name: 'Handwriting Recognition', nameTR: 'El Yazısı Tanıma', category: 'multimedia', hasTemplate: false, icon: '✍', description: 'El yazısı ile cevap yazma', answerType: 'handwriting', requiresOptions: false, supportsMultipleAnswers: false, estimatedTime: 180, bloomLevel: ['Knowledge', 'Application'], displayOrder: 39 },
  { id: 40, code: 'gesture_recognition', name: 'Gesture Recognition', nameTR: 'Hareket Tanıma', category: 'multimedia', hasTemplate: false, icon: '👋', description: 'Hareket ile cevap verme', answerType: 'gesture', requiresOptions: false, supportsMultipleAnswers: false, estimatedTime: 120, bloomLevel: ['Application'], displayOrder: 40 },

  // === ADVANCED TYPES (41-50) ===
  { id: 41, code: 'branching_scenario', name: 'Branching Scenario', nameTR: 'Dallanma Senaryosu', category: 'advanced', hasTemplate: false, icon: '🌳', description: 'Seçimlere göre dallanan senaryo', answerType: 'branching', requiresOptions: false, supportsMultipleAnswers: false, estimatedTime: 600, bloomLevel: ['Analysis', 'Synthesis', 'Evaluation'], displayOrder: 41 },
  { id: 42, code: 'case_study', name: 'Case Study', nameTR: 'Vaka Çalışması', category: 'advanced', hasTemplate: false, icon: '📋', description: 'Detaylı vaka analizi', answerType: 'case_analysis', requiresOptions: false, supportsMultipleAnswers: false, estimatedTime: 1200, bloomLevel: ['Analysis', 'Evaluation'], displayOrder: 42 },
  { id: 43, code: 'problem_solving', name: 'Problem Solving', nameTR: 'Problem Çözme', category: 'advanced', hasTemplate: false, icon: '🧩', description: 'Karmaşık problem çözme', answerType: 'problem', requiresOptions: false, supportsMultipleAnswers: false, estimatedTime: 900, bloomLevel: ['Analysis', 'Synthesis'], displayOrder: 43 },
  { id: 44, code: 'project_based', name: 'Project Based', nameTR: 'Proje Tabanlı', category: 'advanced', hasTemplate: false, icon: '🏗', description: 'Proje oluşturma sorusu', answerType: 'project', requiresOptions: false, supportsMultipleAnswers: false, estimatedTime: 3600, bloomLevel: ['Synthesis', 'Evaluation'], displayOrder: 44 },
  { id: 45, code: 'research_task', name: 'Research Task', nameTR: 'Araştırma Görevi', category: 'advanced', hasTemplate: false, icon: '🔬', description: 'Araştırma yapma görevi', answerType: 'research', requiresOptions: false, supportsMultipleAnswers: false, estimatedTime: 7200, bloomLevel: ['Analysis', 'Synthesis', 'Evaluation'], displayOrder: 45 },
  { id: 46, code: 'peer_review', name: 'Peer Review', nameTR: 'Akran Değerlendirme', category: 'advanced', hasTemplate: false, icon: '👥', description: 'Başkasının çalışmasını değerlendirme', answerType: 'peer_review', requiresOptions: false, supportsMultipleAnswers: false, estimatedTime: 600, bloomLevel: ['Analysis', 'Evaluation'], displayOrder: 46 },
  { id: 47, code: 'portfolio_submission', name: 'Portfolio Submission', nameTR: 'Portfolyo Sunumu', category: 'advanced', hasTemplate: false, icon: '💼', description: 'Çalışma portfolyosu sunma', answerType: 'portfolio', requiresOptions: false, supportsMultipleAnswers: false, estimatedTime: 3600, bloomLevel: ['Synthesis', 'Evaluation'], displayOrder: 47 },
  { id: 48, code: 'debate_argument', name: 'Debate/Argument', nameTR: 'Tartışma/Argüman', category: 'advanced', hasTemplate: false, icon: '⚖', description: 'Argüman geliştirme', answerType: 'debate', requiresOptions: false, supportsMultipleAnswers: false, estimatedTime: 900, bloomLevel: ['Analysis', 'Synthesis', 'Evaluation'], displayOrder: 48 },
  { id: 49, code: 'reflection_journal', name: 'Reflection Journal', nameTR: 'Yansıtma Günlüğü', category: 'advanced', hasTemplate: false, icon: '📖', description: 'Düşünce yansıtma yazısı', answerType: 'reflection', requiresOptions: false, supportsMultipleAnswers: false, estimatedTime: 600, bloomLevel: ['Analysis', 'Synthesis'], displayOrder: 49 },
  { id: 50, code: 'creative_response', name: 'Creative Response', nameTR: 'Yaratıcı Yanıt', category: 'advanced', hasTemplate: false, icon: '🎨', description: 'Yaratıcı cevap üretme', answerType: 'creative', requiresOptions: false, supportsMultipleAnswers: false, estimatedTime: 900, bloomLevel: ['Synthesis'], displayOrder: 50 },

  // === PERFORMANCE TYPES (51-65) ===
  { id: 51, code: 'lab_experiment', name: 'Lab Experiment', nameTR: 'Laboratuvar Deneyi', category: 'performance', hasTemplate: false, icon: '🧪', description: 'Laboratuvar deneyi yapma', answerType: 'lab', requiresOptions: false, supportsMultipleAnswers: false, estimatedTime: 1800, bloomLevel: ['Application', 'Analysis'], displayOrder: 51 },
  { id: 52, code: 'field_observation', name: 'Field Observation', nameTR: 'Saha Gözlemi', category: 'performance', hasTemplate: false, icon: '🔭', description: 'Saha çalışması gözlemi', answerType: 'observation', requiresOptions: false, supportsMultipleAnswers: false, estimatedTime: 2400, bloomLevel: ['Analysis'], displayOrder: 52 },
  { id: 53, code: 'physical_demonstration', name: 'Physical Demonstration', nameTR: 'Fiziksel Gösteri', category: 'performance', hasTemplate: false, icon: '🤸', description: 'Fiziksel beceri gösterimi', answerType: 'physical', requiresOptions: false, supportsMultipleAnswers: false, estimatedTime: 600, bloomLevel: ['Application'], displayOrder: 53 },
  { id: 54, code: 'role_play', name: 'Role Play', nameTR: 'Rol Yapma', category: 'performance', hasTemplate: false, icon: '🎭', description: 'Rol yapma aktivitesi', answerType: 'roleplay', requiresOptions: false, supportsMultipleAnswers: false, estimatedTime: 900, bloomLevel: ['Application', 'Synthesis'], displayOrder: 54 },
  { id: 55, code: 'presentation', name: 'Presentation', nameTR: 'Sunum', category: 'performance', hasTemplate: false, icon: '📊', description: 'Sunum yapma', answerType: 'presentation', requiresOptions: false, supportsMultipleAnswers: false, estimatedTime: 1200, bloomLevel: ['Synthesis', 'Evaluation'], displayOrder: 55 },
  { id: 56, code: 'group_project', name: 'Group Project', nameTR: 'Grup Projesi', category: 'performance', hasTemplate: false, icon: '👥', description: 'Grup çalışması projesi', answerType: 'group_work', requiresOptions: false, supportsMultipleAnswers: false, estimatedTime: 7200, bloomLevel: ['Synthesis', 'Evaluation'], displayOrder: 56 },
  { id: 57, code: 'design_task', name: 'Design Task', nameTR: 'Tasarım Görevi', category: 'performance', hasTemplate: false, icon: '✏', description: 'Tasarım oluşturma', answerType: 'design', requiresOptions: false, supportsMultipleAnswers: false, estimatedTime: 2400, bloomLevel: ['Synthesis'], displayOrder: 57 },
  { id: 58, code: 'construction_task', name: 'Construction Task', nameTR: 'İnşa/Yapım Görevi', category: 'performance', hasTemplate: false, icon: '🔨', description: 'Fiziksel yapım görevi', answerType: 'construction', requiresOptions: false, supportsMultipleAnswers: false, estimatedTime: 3600, bloomLevel: ['Application', 'Synthesis'], displayOrder: 58 },
  { id: 59, code: 'art_creation', name: 'Art Creation', nameTR: 'Sanat Eseri Yaratma', category: 'performance', hasTemplate: false, icon: '🎨', description: 'Sanat eseri oluşturma', answerType: 'art', requiresOptions: false, supportsMultipleAnswers: false, estimatedTime: 2400, bloomLevel: ['Synthesis'], displayOrder: 59 },
  { id: 60, code: 'music_performance', name: 'Music Performance', nameTR: 'Müzik Performansı', category: 'performance', hasTemplate: false, icon: '🎵', description: 'Müzik icra etme', answerType: 'music_performance', requiresOptions: false, supportsMultipleAnswers: false, estimatedTime: 600, bloomLevel: ['Application', 'Synthesis'], displayOrder: 60 },
  { id: 61, code: 'sports_skill', name: 'Sports Skill', nameTR: 'Spor Becerisi', category: 'performance', hasTemplate: false, icon: '⚽', description: 'Spor becerisi gösterimi', answerType: 'sports', requiresOptions: false, supportsMultipleAnswers: false, estimatedTime: 600, bloomLevel: ['Application'], displayOrder: 61 },
  { id: 62, code: 'cooking_task', name: 'Cooking Task', nameTR: 'Yemek Pişirme Görevi', category: 'performance', hasTemplate: false, icon: '🍳', description: 'Yemek yapma görevi', answerType: 'cooking', requiresOptions: false, supportsMultipleAnswers: false, estimatedTime: 1800, bloomLevel: ['Application'], displayOrder: 62 },
  { id: 63, code: 'technical_repair', name: 'Technical Repair', nameTR: 'Teknik Tamir', category: 'performance', hasTemplate: false, icon: '🔧', description: 'Teknik tamir yapma', answerType: 'repair', requiresOptions: false, supportsMultipleAnswers: false, estimatedTime: 1800, bloomLevel: ['Application', 'Analysis'], displayOrder: 63 },
  { id: 64, code: 'assembly_task', name: 'Assembly Task', nameTR: 'Montaj Görevi', category: 'performance', hasTemplate: false, icon: '⚙', description: 'Parçaları birleştirme', answerType: 'assembly', requiresOptions: false, supportsMultipleAnswers: false, estimatedTime: 1200, bloomLevel: ['Application'], displayOrder: 64 },
  { id: 65, code: 'gardening_task', name: 'Gardening Task', nameTR: 'Bahçıvanlık Görevi', category: 'performance', hasTemplate: false, icon: '🌱', description: 'Bahçıvanlık aktivitesi', answerType: 'gardening', requiresOptions: false, supportsMultipleAnswers: false, estimatedTime: 2400, bloomLevel: ['Application'], displayOrder: 65 },
];

// Helper functions
export const getQuestionTypesByCategory = (category: string) => {
  return QUESTION_TYPES.filter(qt => qt.category === category);
};

export const getQuestionTypesWithTemplates = () => {
  return QUESTION_TYPES.filter(qt => qt.hasTemplate);
};

export const getQuestionTypeByCode = (code: string) => {
  return QUESTION_TYPES.find(qt => qt.code === code);
};

export const getQuestionTypeCategories = () => {
  return Array.from(new Set(QUESTION_TYPES.map(qt => qt.category)));
};

export const CATEGORY_LABELS = {
  classic: 'Klasik Sorular',
  modern: 'Modern Sorular',
  interactive: 'İnteraktif Sorular',
  multimedia: 'Multimedya Sorular',
  advanced: 'İleri Seviye',
  performance: 'Performans Değerlendirme',
};

export const CATEGORY_ICONS = {
  classic: '📝',
  modern: '💡',
  interactive: '🎮',
  multimedia: '🎬',
  advanced: '🎓',
  performance: '🏆',
};

export const CATEGORY_COLORS = {
  classic: 'blue',
  modern: 'green',
  interactive: 'purple',
  multimedia: 'pink',
  advanced: 'orange',
  performance: 'red',
};

