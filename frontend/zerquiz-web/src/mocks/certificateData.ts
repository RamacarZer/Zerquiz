import { generateUUID } from '../lib/mockStorage';
import { demoResults } from './gradingDemoData';
import { demoExams } from './examDemoData';

// ==================== SERTİFİKA VERİLERİ ====================

export interface Certificate {
  id: string;
  studentId: string;
  studentName: string;
  examId: string;
  examTitle: string;
  score: number;
  grade: string;
  issueDate: string;
  certificateNumber: string;
  template: string;
  qrCode: string;
  verificationUrl: string;
  status: 'issued' | 'revoked' | 'pending';
}

export interface CertificateTemplate {
  id: string;
  name: string;
  description: string;
  category: 'achievement' | 'completion' | 'excellence' | 'participation';
  design: {
    backgroundColor: string;
    borderColor: string;
    accentColor: string;
    font: string;
  };
  requirements: {
    minScore?: number;
    minGrade?: string;
    examTypes?: string[];
  };
}

// ==================== SERTİFİKA ŞABLONLARI ====================

export const certificateTemplates: CertificateTemplate[] = [
  {
    id: 'tpl-001',
    name: 'Başarı Sertifikası',
    description: 'Başarılı öğrenciler için altın çerçeveli sertifika',
    category: 'achievement',
    design: {
      backgroundColor: '#FFF7ED',
      borderColor: '#D97706',
      accentColor: '#F59E0B',
      font: 'Georgia',
    },
    requirements: {
      minScore: 80,
      minGrade: 'B',
    },
  },
  {
    id: 'tpl-002',
    name: 'Mükemmellik Sertifikası',
    description: 'Mükemmel performans gösteren öğrenciler için',
    category: 'excellence',
    design: {
      backgroundColor: '#ECFDF5',
      borderColor: '#059669',
      accentColor: '#10B981',
      font: 'Georgia',
    },
    requirements: {
      minScore: 95,
      minGrade: 'A+',
    },
  },
  {
    id: 'tpl-003',
    name: 'Tamamlama Sertifikası',
    description: 'Sınavı tamamlayan tüm öğrenciler için',
    category: 'completion',
    design: {
      backgroundColor: '#EFF6FF',
      borderColor: '#2563EB',
      accentColor: '#3B82F6',
      font: 'Arial',
    },
    requirements: {
      minScore: 60,
    },
  },
  {
    id: 'tpl-004',
    name: 'Katılım Sertifikası',
    description: 'Etkinliğe katılan tüm öğrenciler için',
    category: 'participation',
    design: {
      backgroundColor: '#F5F3FF',
      borderColor: '#7C3AED',
      accentColor: '#8B5CF6',
      font: 'Verdana',
    },
    requirements: {},
  },
];

// ==================== SERTİFİKA NUMARASI ÜRET ====================

function generateCertificateNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `CERT-${year}-${random}`;
}

// ==================== QR KOD & DOĞRULAMA ====================

function generateQRCode(certificateId: string): string {
  // Simulate QR code data URL
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://zerquiz.com/verify/${certificateId}`;
}

function generateVerificationUrl(certificateId: string): string {
  return `https://zerquiz.com/verify/${certificateId}`;
}

// ==================== SERTİFİKA OLUŞTUR ====================

function createCertificate(result: any, exam: any): Certificate {
  const template = certificateTemplates.find(t => {
    if (!t.requirements.minScore) return true;
    return result.score >= t.requirements.minScore;
  }) || certificateTemplates[2]; // Default to completion

  const certificateId = generateUUID();

  return {
    id: certificateId,
    studentId: result.studentId,
    studentName: result.studentName,
    examId: exam.id,
    examTitle: exam.title,
    score: result.score,
    grade: result.grade,
    issueDate: new Date().toISOString(),
    certificateNumber: generateCertificateNumber(),
    template: template.id,
    qrCode: generateQRCode(certificateId),
    verificationUrl: generateVerificationUrl(certificateId),
    status: 'issued',
  };
}

// ==================== DEMO SERTİFİKALAR ====================

function generateDemoCertificates(): Certificate[] {
  const certificates: Certificate[] = [];
  
  // Get passed students
  const passedResults = demoResults.filter(r => r.passed);
  
  passedResults.forEach(result => {
    const exam = demoExams.find(e => e.id === result.examId);
    if (exam) {
      certificates.push(createCertificate(result, exam));
    }
  });

  return certificates;
}

export const demoCertificates = generateDemoCertificates();

// ==================== HELPER FONKSİYONLAR ====================

export function getCertificatesByStudent(studentId: string): Certificate[] {
  return demoCertificates.filter(c => c.studentId === studentId);
}

export function getCertificateById(certificateId: string): Certificate | undefined {
  return demoCertificates.find(c => c.id === certificateId);
}

export function verifyCertificate(certificateNumber: string): Certificate | undefined {
  return demoCertificates.find(c => c.certificateNumber === certificateNumber);
}

export function getCertificateStats() {
  const total = demoCertificates.length;
  const byCategory = certificateTemplates.map(template => ({
    template: template.name,
    count: demoCertificates.filter(c => c.template === template.id).length,
  }));

  const avgScore = demoCertificates.length > 0
    ? Math.round(demoCertificates.reduce((sum, c) => sum + c.score, 0) / demoCertificates.length)
    : 0;

  return {
    total,
    byCategory,
    avgScore,
    issued: demoCertificates.filter(c => c.status === 'issued').length,
    revoked: demoCertificates.filter(c => c.status === 'revoked').length,
  };
}

export function generateCertificatePDF(certificate: Certificate): void {
  // Simulate PDF generation
  const template = certificateTemplates.find(t => t.id === certificate.template);
  alert(`
    📜 Sertifika PDF Oluşturuldu!
    
    Öğrenci: ${certificate.studentName}
    Sınav: ${certificate.examTitle}
    Not: ${certificate.score} (${certificate.grade})
    Sertifika No: ${certificate.certificateNumber}
    Şablon: ${template?.name}
    
    PDF indirilmeye hazır...
  `);
}

