import { generateUUID } from '../lib/mockStorage';
import { demoExams } from './examDemoData';
import { demoQuestions } from './questionDemoData';

// ==================== DEĞERLENDİRME DEMO VERİLERİ ====================

export interface StudentResult {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  studentNumber: string;
  bookletVariant: string;
  startTime: string;
  endTime: string;
  duration: number; // dakika
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  emptyAnswers: number;
  score: number; // 0-100
  grade: string; // A+, A, B+, B, C, D, F
  passed: boolean;
  rank?: number;
  percentile?: number;
  answers: StudentAnswer[];
  submittedAt: string;
  gradedAt?: string;
  gradedBy?: string;
}

export interface StudentAnswer {
  questionId: string;
  questionOrder: number;
  selectedAnswer?: string;
  correctAnswer: string;
  isCorrect: boolean;
  points: number;
  earnedPoints: number;
  timeSpent: number; // saniye
}

export interface ExamGradingStats {
  examId: string;
  totalStudents: number;
  gradedStudents: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  passRate: number; // %
  averageTime: number; // dakika
  questionStats: QuestionStats[];
}

export interface QuestionStats {
  questionId: string;
  questionOrder: number;
  totalAnswers: number;
  correctAnswers: number;
  wrongAnswers: number;
  emptyAnswers: number;
  successRate: number; // %
  averageTime: number; // saniye
  difficulty: 'very_easy' | 'easy' | 'medium' | 'hard' | 'very_hard';
}

// ==================== DEMO ÖĞRENCİLER ====================

const DEMO_STUDENTS = [
  { id: 'std-001', name: 'Ahmet Yılmaz', number: '2024001' },
  { id: 'std-002', name: 'Ayşe Demir', number: '2024002' },
  { id: 'std-003', name: 'Mehmet Kaya', number: '2024003' },
  { id: 'std-004', name: 'Fatma Çelik', number: '2024004' },
  { id: 'std-005', name: 'Ali Şahin', number: '2024005' },
  { id: 'std-006', name: 'Zeynep Yıldız', number: '2024006' },
  { id: 'std-007', name: 'Mustafa Aydın', number: '2024007' },
  { id: 'std-008', name: 'Elif Öztürk', number: '2024008' },
  { id: 'std-009', name: 'Hasan Arslan', number: '2024009' },
  { id: 'std-010', name: 'Merve Koç', number: '2024010' },
  { id: 'std-011', name: 'Emre Yılmaz', number: '2024011' },
  { id: 'std-012', name: 'Selin Aktaş', number: '2024012' },
  { id: 'std-013', name: 'Burak Kara', number: '2024013' },
  { id: 'std-014', name: 'Deniz Çetin', number: '2024014' },
  { id: 'std-015', name: 'Can Yıldırım', number: '2024015' },
];

// ==================== NOT HESAPlAMA ====================

function calculateGrade(score: number): string {
  if (score >= 95) return 'A+';
  if (score >= 90) return 'A';
  if (score >= 85) return 'B+';
  if (score >= 80) return 'B';
  if (score >= 75) return 'C+';
  if (score >= 70) return 'C';
  if (score >= 65) return 'D+';
  if (score >= 60) return 'D';
  return 'F';
}

// ==================== RASTGELE CEVAP ÜRET ====================

function generateRandomAnswer(correctAnswer: string, successRate: number = 0.7): {
  selected: string;
  isCorrect: boolean;
} {
  const isCorrect = Math.random() < successRate;
  
  if (isCorrect) {
    return { selected: correctAnswer, isCorrect: true };
  }
  
  const options = ['A', 'B', 'C', 'D', 'E'];
  const wrongOptions = options.filter(opt => opt !== correctAnswer);
  const selected = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
  
  return { selected, isCorrect: false };
}

// ==================== ÖĞRENCİ SONUCU OLUŞTUR ====================

function generateStudentResult(exam: any, student: any, questionCount: number = 20): StudentResult {
  const bookletVariants = ['A', 'B', 'C', 'D'];
  const bookletVariant = bookletVariants[Math.floor(Math.random() * bookletVariants.length)];
  
  // Rastgele başarı oranı (%40-%95)
  const studentSuccessRate = 0.4 + Math.random() * 0.55;
  
  const startTime = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2 saat önce
  const duration = exam.duration - Math.floor(Math.random() * 20); // Sürenin biraz altında
  const endTime = new Date(startTime.getTime() + duration * 60 * 1000);
  
  const answers: StudentAnswer[] = [];
  let correctCount = 0;
  let totalPoints = 0;
  let earnedPoints = 0;
  
  // Rastgele sorular seç
  const selectedQuestions = [...demoQuestions]
    .filter(q => q.status === 'published')
    .sort(() => 0.5 - Math.random())
    .slice(0, questionCount);
  
  selectedQuestions.forEach((question, index) => {
    const correctAnswer = question.options?.find(opt => opt.isCorrect)?.key || 'A';
    const points = 5;
    totalPoints += points;
    
    // %5 boş bırakma şansı
    const isEmpty = Math.random() < 0.05;
    
    if (isEmpty) {
      answers.push({
        questionId: question.id,
        questionOrder: index + 1,
        selectedAnswer: undefined,
        correctAnswer,
        isCorrect: false,
        points,
        earnedPoints: 0,
        timeSpent: Math.floor(Math.random() * 60) + 30,
      });
    } else {
      const { selected, isCorrect } = generateRandomAnswer(correctAnswer, studentSuccessRate);
      
      if (isCorrect) {
        correctCount++;
        earnedPoints += points;
      }
      
      answers.push({
        questionId: question.id,
        questionOrder: index + 1,
        selectedAnswer: selected,
        correctAnswer,
        isCorrect,
        points,
        earnedPoints: isCorrect ? points : 0,
        timeSpent: Math.floor(Math.random() * 120) + 30,
      });
    }
  });
  
  const answeredCount = answers.filter(a => a.selectedAnswer).length;
  const wrongCount = answeredCount - correctCount;
  const emptyCount = questionCount - answeredCount;
  const score = Math.round((earnedPoints / totalPoints) * 100);
  const grade = calculateGrade(score);
  const passed = score >= exam.passingScore;
  
  return {
    id: generateUUID(),
    examId: exam.id,
    studentId: student.id,
    studentName: student.name,
    studentNumber: student.number,
    bookletVariant,
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    duration,
    totalQuestions: questionCount,
    answeredQuestions: answeredCount,
    correctAnswers: correctCount,
    wrongAnswers: wrongCount,
    emptyAnswers: emptyCount,
    score,
    grade,
    passed,
    answers,
    submittedAt: endTime.toISOString(),
    gradedAt: new Date(endTime.getTime() + 5 * 60 * 1000).toISOString(), // 5 dk sonra notlandı
    gradedBy: 'auto-grading-system',
  };
}

// ==================== SINAV İSTATİSTİKLERİ ====================

function calculateExamStats(examId: string, results: StudentResult[]): ExamGradingStats {
  const examResults = results.filter(r => r.examId === examId);
  
  if (examResults.length === 0) {
    return {
      examId,
      totalStudents: 0,
      gradedStudents: 0,
      averageScore: 0,
      highestScore: 0,
      lowestScore: 0,
      passRate: 0,
      averageTime: 0,
      questionStats: [],
    };
  }
  
  const totalStudents = examResults.length;
  const gradedStudents = examResults.filter(r => r.gradedAt).length;
  const scores = examResults.map(r => r.score);
  const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  const highestScore = Math.max(...scores);
  const lowestScore = Math.min(...scores);
  const passedCount = examResults.filter(r => r.passed).length;
  const passRate = (passedCount / totalStudents) * 100;
  const averageTime = examResults.reduce((sum, r) => sum + r.duration, 0) / examResults.length;
  
  // Soru bazlı istatistikler
  const questionMap = new Map<string, any>();
  
  examResults.forEach(result => {
    result.answers.forEach(answer => {
      if (!questionMap.has(answer.questionId)) {
        questionMap.set(answer.questionId, {
          questionId: answer.questionId,
          questionOrder: answer.questionOrder,
          totalAnswers: 0,
          correctAnswers: 0,
          wrongAnswers: 0,
          emptyAnswers: 0,
          totalTime: 0,
        });
      }
      
      const qStats = questionMap.get(answer.questionId);
      qStats.totalAnswers++;
      
      if (!answer.selectedAnswer) {
        qStats.emptyAnswers++;
      } else if (answer.isCorrect) {
        qStats.correctAnswers++;
      } else {
        qStats.wrongAnswers++;
      }
      
      qStats.totalTime += answer.timeSpent;
    });
  });
  
  const questionStats: QuestionStats[] = Array.from(questionMap.values()).map(q => {
    const successRate = (q.correctAnswers / q.totalAnswers) * 100;
    const averageTime = q.totalTime / q.totalAnswers;
    
    let difficulty: QuestionStats['difficulty'];
    if (successRate >= 80) difficulty = 'very_easy';
    else if (successRate >= 65) difficulty = 'easy';
    else if (successRate >= 50) difficulty = 'medium';
    else if (successRate >= 35) difficulty = 'hard';
    else difficulty = 'very_hard';
    
    return {
      questionId: q.questionId,
      questionOrder: q.questionOrder,
      totalAnswers: q.totalAnswers,
      correctAnswers: q.correctAnswers,
      wrongAnswers: q.wrongAnswers,
      emptyAnswers: q.emptyAnswers,
      successRate: Math.round(successRate),
      averageTime: Math.round(averageTime),
      difficulty,
    };
  });
  
  return {
    examId,
    totalStudents,
    gradedStudents,
    averageScore: Math.round(averageScore * 10) / 10,
    highestScore,
    lowestScore,
    passRate: Math.round(passRate * 10) / 10,
    averageTime: Math.round(averageTime),
    questionStats: questionStats.sort((a, b) => a.questionOrder - b.questionOrder),
  };
}

// ==================== DEMO SONUÇLARI OLUŞTUR ====================

function generateDemoResults(): StudentResult[] {
  const completedExams = demoExams.filter(e => e.status === 'completed');
  const results: StudentResult[] = [];
  
  completedExams.forEach(exam => {
    const studentCount = Math.min(exam.participantCount || 10, DEMO_STUDENTS.length);
    const selectedStudents = DEMO_STUDENTS.slice(0, studentCount);
    
    selectedStudents.forEach(student => {
      const result = generateStudentResult(exam, student, exam.questionCount);
      results.push(result);
    });
  });
  
  // Sıralama ve percentile hesapla
  const examGroups = new Map<string, StudentResult[]>();
  results.forEach(result => {
    if (!examGroups.has(result.examId)) {
      examGroups.set(result.examId, []);
    }
    examGroups.get(result.examId)!.push(result);
  });
  
  examGroups.forEach((examResults, examId) => {
    const sorted = examResults.sort((a, b) => b.score - a.score);
    sorted.forEach((result, index) => {
      result.rank = index + 1;
      result.percentile = Math.round(((sorted.length - index) / sorted.length) * 100);
    });
  });
  
  return results;
}

export const demoResults = generateDemoResults();

// ==================== HELPER FONKSİYONLAR ====================

export function getResultsByExam(examId: string): StudentResult[] {
  return demoResults.filter(r => r.examId === examId);
}

export function getResultById(resultId: string): StudentResult | undefined {
  return demoResults.find(r => r.id === resultId);
}

export function getExamStats(examId: string): ExamGradingStats {
  const examResults = getResultsByExam(examId);
  return calculateExamStats(examId, examResults);
}

export function getTopStudents(examId: string, count: number = 10): StudentResult[] {
  return getResultsByExam(examId)
    .sort((a, b) => b.score - a.score)
    .slice(0, count);
}

export function getGradeDistribution(examId: string): Record<string, number> {
  const results = getResultsByExam(examId);
  const distribution: Record<string, number> = {};
  
  results.forEach(result => {
    distribution[result.grade] = (distribution[result.grade] || 0) + 1;
  });
  
  return distribution;
}

export function getScoreDistribution(examId: string): { range: string; count: number }[] {
  const results = getResultsByExam(examId);
  const ranges = [
    { min: 0, max: 20, label: '0-20' },
    { min: 20, max: 40, label: '20-40' },
    { min: 40, max: 60, label: '40-60' },
    { min: 60, max: 80, label: '60-80' },
    { min: 80, max: 100, label: '80-100' },
  ];
  
  return ranges.map(range => ({
    range: range.label,
    count: results.filter(r => r.score >= range.min && r.score < range.max).length,
  }));
}

