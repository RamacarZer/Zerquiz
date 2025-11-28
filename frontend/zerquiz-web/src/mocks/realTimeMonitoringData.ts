/**
 * Real-time Monitoring Mock Data
 * Canlı sınav izleme için demo verileri
 */

export interface StudentLiveStatus {
  id: string;
  studentNumber: string;
  name: string;
  email: string;
  institution: string;
  seatNumber: string;
  
  // Sınav durumu
  currentQuestionIndex: number;
  totalQuestions: number;
  answeredCount: number;
  flaggedCount: number;
  timeRemaining: number; // saniye
  timeElapsed: number; // saniye
  
  // Proctoring
  webcamActive: boolean;
  webcamThumbnail: string; // base64 veya URL
  isFullScreen: boolean;
  screenRecording: boolean;
  
  // İhlaller
  violations: Violation[];
  warningCount: number;
  suspiciousActivity: boolean;
  
  // Performans
  averageTimePerQuestion: number; // saniye
  lastActivity: Date;
  status: 'active' | 'idle' | 'submitted' | 'disconnected' | 'flagged';
  
  // Konum
  ipAddress: string;
  location: string;
  device: string;
  browser: string;
}

export interface Violation {
  id: string;
  type: 'tab_switch' | 'exit_fullscreen' | 'face_not_detected' | 'multiple_faces' | 
        'copy_paste' | 'right_click' | 'suspicious_movement' | 'network_change' | 'vm_detected';
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  screenshotUrl?: string;
  autoResolved: boolean;
}

export interface ExamLiveStats {
  examId: string;
  examTitle: string;
  totalRegistered: number;
  activeNow: number;
  submitted: number;
  notStarted: number;
  disconnected: number;
  flagged: number;
  totalViolations: number;
  averageProgress: number; // %
  averageTimeRemaining: number; // saniye
  startTime: Date;
  endTime: Date;
}

export interface ProctorAlert {
  id: string;
  studentId: string;
  studentName: string;
  type: 'violation' | 'help_request' | 'technical_issue' | 'suspicious_pattern';
  severity: 'info' | 'warning' | 'critical';
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  resolvedBy?: string;
  resolvedAt?: Date;
}

// Mock Data Generator
const generateRandomStudentStatus = (index: number): StudentLiveStatus => {
  const names = [
    'Ali Yılmaz', 'Zeynep Kaya', 'Mehmet Demir', 'Ayşe Şahin', 'Ahmet Çelik',
    'Fatma Öztürk', 'Mustafa Aydın', 'Elif Arslan', 'Emre Koç', 'Selin Özkan',
    'Burak Yıldız', 'Deniz Aksoy', 'Can Özer', 'Merve Polat', 'Cem Şimşek',
    'Gizem Acar', 'Barış Kılıç', 'Ebru Çetin', 'Onur Kara', 'Esra Güneş',
    'Kerem Yurt', 'İrem Taş', 'Serkan Bulut', 'Gül Aktaş', 'Tolga Kurt',
    'Seda Türk', 'Okan Yıldırım', 'Pınar Kocaman', 'Utku Tekin', 'Zehra Şen'
  ];
  
  const institutions = [
    'Atatürk Anadolu Lisesi', 'Fatih Fen Lisesi', 'İstanbul Koleji', 
    'Bahçeşehir Lisesi', 'TED Ankara Koleji'
  ];
  
  const devices = ['Windows PC', 'MacBook', 'iPad', 'Chromebook', 'Android Tablet'];
  const browsers = ['Chrome 120', 'Firefox 121', 'Safari 17', 'Edge 120'];
  
  const statuses: StudentLiveStatus['status'][] = ['active', 'idle', 'active', 'active', 'flagged', 'active', 'disconnected'];
  
  const totalQuestions = 40;
  const currentQuestion = Math.floor(Math.random() * totalQuestions);
  const answered = Math.floor(Math.random() * currentQuestion);
  const timeElapsed = Math.floor(Math.random() * 3600); // 0-60 dakika
  const timeRemaining = 5400 - timeElapsed; // 90 dakika toplam
  
  const violations: Violation[] = [];
  const violationCount = Math.floor(Math.random() * 4);
  
  for (let i = 0; i < violationCount; i++) {
    const types: Violation['type'][] = ['tab_switch', 'exit_fullscreen', 'face_not_detected', 'multiple_faces'];
    const severities: Violation['severity'][] = ['low', 'medium', 'high'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    
    violations.push({
      id: `vio-${index}-${i}`,
      type: randomType,
      timestamp: new Date(Date.now() - Math.random() * 1800000),
      severity: severities[Math.floor(Math.random() * severities.length)],
      description: getViolationDescription(randomType),
      autoResolved: Math.random() > 0.5,
    });
  }
  
  return {
    id: `student-${index}`,
    studentNumber: `2024${(1000 + index).toString()}`,
    name: names[index % names.length],
    email: `student${index}@example.com`,
    institution: institutions[Math.floor(Math.random() * institutions.length)],
    seatNumber: `A${(index + 1).toString().padStart(2, '0')}`,
    
    currentQuestionIndex: currentQuestion,
    totalQuestions: totalQuestions,
    answeredCount: answered,
    flaggedCount: Math.floor(Math.random() * 5),
    timeRemaining: timeRemaining,
    timeElapsed: timeElapsed,
    
    webcamActive: Math.random() > 0.1,
    webcamThumbnail: `https://i.pravatar.cc/150?img=${index + 1}`,
    isFullScreen: Math.random() > 0.2,
    screenRecording: Math.random() > 0.15,
    
    violations: violations,
    warningCount: violations.length,
    suspiciousActivity: violations.length > 2,
    
    averageTimePerQuestion: 60 + Math.floor(Math.random() * 60),
    lastActivity: new Date(Date.now() - Math.random() * 300000),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    
    ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    location: 'İstanbul, TR',
    device: devices[Math.floor(Math.random() * devices.length)],
    browser: browsers[Math.floor(Math.random() * browsers.length)],
  };
};

const getViolationDescription = (type: Violation['type']): string => {
  const descriptions: Record<Violation['type'], string> = {
    tab_switch: 'Sekme değiştirme tespit edildi',
    exit_fullscreen: 'Tam ekrandan çıkış yapıldı',
    face_not_detected: 'Yüz tespit edilemedi',
    multiple_faces: 'Birden fazla yüz tespit edildi',
    copy_paste: 'Kopyala/Yapıştır girişimi',
    right_click: 'Sağ tık kullanımı',
    suspicious_movement: 'Şüpheli hareket tespit edildi',
    network_change: 'Ağ değişikliği tespit edildi',
    vm_detected: 'Sanal makine tespit edildi',
  };
  return descriptions[type];
};

// 30 öğrenci için mock data
export const mockStudentsLiveStatus: StudentLiveStatus[] = Array.from(
  { length: 30 },
  (_, i) => generateRandomStudentStatus(i)
);

export const mockExamLiveStats: ExamLiveStats = {
  examId: 'exam-001',
  examTitle: 'TYT Matematik Deneme Sınavı - 1',
  totalRegistered: 30,
  activeNow: mockStudentsLiveStatus.filter(s => s.status === 'active').length,
  submitted: mockStudentsLiveStatus.filter(s => s.status === 'submitted').length,
  notStarted: 0,
  disconnected: mockStudentsLiveStatus.filter(s => s.status === 'disconnected').length,
  flagged: mockStudentsLiveStatus.filter(s => s.status === 'flagged').length,
  totalViolations: mockStudentsLiveStatus.reduce((sum, s) => sum + s.violations.length, 0),
  averageProgress: Math.floor(
    mockStudentsLiveStatus.reduce((sum, s) => sum + (s.currentQuestionIndex / s.totalQuestions * 100), 0) / 
    mockStudentsLiveStatus.length
  ),
  averageTimeRemaining: Math.floor(
    mockStudentsLiveStatus.reduce((sum, s) => sum + s.timeRemaining, 0) / 
    mockStudentsLiveStatus.length
  ),
  startTime: new Date(Date.now() - 1800000), // 30 dakika önce başladı
  endTime: new Date(Date.now() + 3600000), // 60 dakika sonra bitecek
};

export const mockProctorAlerts: ProctorAlert[] = [
  {
    id: 'alert-001',
    studentId: 'student-5',
    studentName: 'Ahmet Çelik',
    type: 'violation',
    severity: 'critical',
    message: '3 kez sekme değiştirme tespit edildi',
    timestamp: new Date(Date.now() - 300000),
    acknowledged: false,
  },
  {
    id: 'alert-002',
    studentId: 'student-12',
    studentName: 'Can Özer',
    type: 'help_request',
    severity: 'warning',
    message: 'Öğrenci yardım talep etti',
    timestamp: new Date(Date.now() - 180000),
    acknowledged: true,
    resolvedBy: 'Gözetmen Ahmet B.',
    resolvedAt: new Date(Date.now() - 120000),
  },
  {
    id: 'alert-003',
    studentId: 'student-18',
    studentName: 'Ebru Çetin',
    type: 'technical_issue',
    severity: 'warning',
    message: 'Webcam bağlantısı kesildi',
    timestamp: new Date(Date.now() - 600000),
    acknowledged: false,
  },
  {
    id: 'alert-004',
    studentId: 'student-23',
    studentName: 'Serkan Bulut',
    type: 'suspicious_pattern',
    severity: 'critical',
    message: 'Anormal hızlı cevaplama tespit edildi',
    timestamp: new Date(Date.now() - 900000),
    acknowledged: false,
  },
];

// Helper Functions
export const getStudentById = (id: string): StudentLiveStatus | undefined => {
  return mockStudentsLiveStatus.find(s => s.id === id);
};

export const getActiveStudents = (): StudentLiveStatus[] => {
  return mockStudentsLiveStatus.filter(s => s.status === 'active');
};

export const getFlaggedStudents = (): StudentLiveStatus[] => {
  return mockStudentsLiveStatus.filter(s => s.status === 'flagged' || s.suspiciousActivity);
};

export const getUnacknowledgedAlerts = (): ProctorAlert[] => {
  return mockProctorAlerts.filter(a => !a.acknowledged);
};

export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

export const getStatusColor = (status: StudentLiveStatus['status']): string => {
  const colors = {
    active: 'text-green-600 bg-green-100',
    idle: 'text-yellow-600 bg-yellow-100',
    submitted: 'text-blue-600 bg-blue-100',
    disconnected: 'text-red-600 bg-red-100',
    flagged: 'text-orange-600 bg-orange-100',
  };
  return colors[status];
};

export const getStatusLabel = (status: StudentLiveStatus['status']): string => {
  const labels = {
    active: 'Aktif',
    idle: 'Beklemede',
    submitted: 'Teslim Etti',
    disconnected: 'Bağlantı Kesildi',
    flagged: 'İşaretli',
  };
  return labels[status];
};

export const getSeverityColor = (severity: 'low' | 'medium' | 'high' | 'critical' | 'info' | 'warning'): string => {
  const colors = {
    info: 'text-blue-600 bg-blue-100',
    low: 'text-gray-600 bg-gray-100',
    medium: 'text-yellow-600 bg-yellow-100',
    warning: 'text-orange-600 bg-orange-100',
    high: 'text-red-600 bg-red-100',
    critical: 'text-purple-600 bg-purple-100',
  };
  return colors[severity];
};

