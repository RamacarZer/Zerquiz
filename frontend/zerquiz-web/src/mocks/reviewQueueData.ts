import { generateUUID } from '../lib/mockStorage';
import { demoQuestions } from './questionDemoData';

// ==================== REVIEW QUEUE VERİLERİ ====================

export interface QuestionReview {
  id: string;
  questionId: string;
  status: 'pending' | 'in_review' | 'approved' | 'rejected' | 'needs_revision';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  submittedBy: string;
  submittedAt: string;
  assignedTo?: string;
  assignedAt?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  comments: ReviewComment[];
  history: ReviewHistoryEntry[];
  metadata: {
    version: number;
    category: string;
    tags: string[];
  };
}

export interface ReviewComment {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  comment: string;
  type: 'feedback' | 'question' | 'suggestion' | 'issue';
  createdAt: string;
  isInternal: boolean;
}

export interface ReviewHistoryEntry {
  id: string;
  action: 'submitted' | 'assigned' | 'commented' | 'approved' | 'rejected' | 'revision_requested' | 'resubmitted';
  userId: string;
  userName: string;
  timestamp: string;
  details?: string;
}

// ==================== DEMO KULLANICILAR ====================

const REVIEWERS = [
  { id: 'rev-001', name: 'Dr. Ahmet Yılmaz', role: 'Baş Editör' },
  { id: 'rev-002', name: 'Ayşe Demir', role: 'Kıdemli Editör' },
  { id: 'rev-003', name: 'Mehmet Kaya', role: 'Editör' },
  { id: 'rev-004', name: 'Fatma Çelik', role: 'Uzman Editör' },
];

const AUTHORS = [
  { id: 'auth-001', name: 'Ali Şahin' },
  { id: 'auth-002', name: 'Zeynep Yıldız' },
  { id: 'auth-003', name: 'Mustafa Aydın' },
  { id: 'auth-004', name: 'Elif Öztürk' },
  { id: 'auth-005', name: 'Hasan Arslan' },
];

// ==================== YORUM TİPLERİ ====================

const COMMENT_TEMPLATES = {
  feedback: [
    'Soru metni daha net olmalı.',
    'Şıklar birbirine çok benziyor.',
    'Açıklama kısmı daha detaylı olmalı.',
    'Görsel kalitesi artırılmalı.',
  ],
  question: [
    'Bu sorunun zorluk seviyesi doğru mu?',
    'Hangi kazanıma yönelik?',
    'Benzer bir soru var mı?',
    'Kaynak belirtilmeli mi?',
  ],
  suggestion: [
    'Şık C daha cazip hale getirilebilir.',
    'Üst bilgi eklenebilir.',
    'Alternatif çözüm yolu eklenebilir.',
    'Video açıklama eklenebilir.',
  ],
  issue: [
    'Doğru cevap işaretlenmemiş!',
    'Yazım hatası var.',
    'Matematik gösterimi hatalı.',
    'Şık sayısı yetersiz.',
  ],
};

// ==================== REVIEW OLUŞTUR ====================

function createQuestionReview(question: any, statusType: QuestionReview['status']): QuestionReview {
  const author = AUTHORS[Math.floor(Math.random() * AUTHORS.length)];
  const reviewer = REVIEWERS[Math.floor(Math.random() * REVIEWERS.length)];
  
  const now = new Date();
  const submittedTime = new Date(now.getTime() - Math.random() * 10 * 24 * 60 * 60 * 1000); // Son 10 gün
  
  const priority: QuestionReview['priority'] = 
    Math.random() > 0.8 ? 'urgent' :
    Math.random() > 0.6 ? 'high' :
    Math.random() > 0.3 ? 'normal' : 'low';

  const comments: ReviewComment[] = [];
  const history: ReviewHistoryEntry[] = [];

  // Submitted event
  history.push({
    id: generateUUID(),
    action: 'submitted',
    userId: author.id,
    userName: author.name,
    timestamp: submittedTime.toISOString(),
    details: 'Soru onaya gönderildi',
  });

  // Assigned event
  if (statusType !== 'pending') {
    const assignedTime = new Date(submittedTime.getTime() + Math.random() * 2 * 24 * 60 * 60 * 1000);
    history.push({
      id: generateUUID(),
      action: 'assigned',
      userId: reviewer.id,
      userName: reviewer.name,
      timestamp: assignedTime.toISOString(),
      details: `${reviewer.name} tarafından incelemeye alındı`,
    });
  }

  // Comments
  if (statusType === 'in_review' || statusType === 'needs_revision') {
    const commentCount = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < commentCount; i++) {
      const commentType = ['feedback', 'question', 'suggestion', 'issue'][Math.floor(Math.random() * 4)] as ReviewComment['type'];
      const templates = COMMENT_TEMPLATES[commentType];
      const commentText = templates[Math.floor(Math.random() * templates.length)];
      
      const commentTime = new Date(submittedTime.getTime() + (i + 2) * 24 * 60 * 60 * 1000);
      
      comments.push({
        id: generateUUID(),
        userId: reviewer.id,
        userName: reviewer.name,
        userRole: reviewer.role,
        comment: commentText,
        type: commentType,
        createdAt: commentTime.toISOString(),
        isInternal: Math.random() > 0.7,
      });

      history.push({
        id: generateUUID(),
        action: 'commented',
        userId: reviewer.id,
        userName: reviewer.name,
        timestamp: commentTime.toISOString(),
        details: `Yorum eklendi: ${commentType}`,
      });
    }
  }

  // Final action
  if (statusType === 'approved') {
    const approvedTime = new Date(submittedTime.getTime() + 5 * 24 * 60 * 60 * 1000);
    history.push({
      id: generateUUID(),
      action: 'approved',
      userId: reviewer.id,
      userName: reviewer.name,
      timestamp: approvedTime.toISOString(),
      details: 'Soru onaylandı ve yayına alındı',
    });
  } else if (statusType === 'rejected') {
    const rejectedTime = new Date(submittedTime.getTime() + 3 * 24 * 60 * 60 * 1000);
    comments.push({
      id: generateUUID(),
      userId: reviewer.id,
      userName: reviewer.name,
      userRole: reviewer.role,
      comment: 'Soru kriterlere uygun değil. Lütfen yeniden düzenleyin.',
      type: 'issue',
      createdAt: rejectedTime.toISOString(),
      isInternal: false,
    });
    history.push({
      id: generateUUID(),
      action: 'rejected',
      userId: reviewer.id,
      userName: reviewer.name,
      timestamp: rejectedTime.toISOString(),
      details: 'Soru reddedildi',
    });
  } else if (statusType === 'needs_revision') {
    const revisionTime = new Date(submittedTime.getTime() + 4 * 24 * 60 * 60 * 1000);
    history.push({
      id: generateUUID(),
      action: 'revision_requested',
      userId: reviewer.id,
      userName: reviewer.name,
      timestamp: revisionTime.toISOString(),
      details: 'Revizyon istendi',
    });
  }

  return {
    id: generateUUID(),
    questionId: question.id,
    status: statusType,
    priority,
    submittedBy: author.name,
    submittedAt: submittedTime.toISOString(),
    assignedTo: statusType !== 'pending' ? reviewer.name : undefined,
    assignedAt: statusType !== 'pending' ? new Date(submittedTime.getTime() + 60000).toISOString() : undefined,
    reviewedBy: (statusType === 'approved' || statusType === 'rejected') ? reviewer.name : undefined,
    reviewedAt: (statusType === 'approved' || statusType === 'rejected') ? new Date(submittedTime.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString() : undefined,
    comments,
    history: history.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
    metadata: {
      version: 1,
      category: question.subjectId || 'general',
      tags: question.tags || [],
    },
  };
}

// ==================== DEMO REVIEWS OLUŞTUR ====================

function generateDemoReviews(): QuestionReview[] {
  const reviews: QuestionReview[] = [];
  
  // Status dağılımı
  const statusDistribution = {
    pending: 8,
    in_review: 12,
    needs_revision: 6,
    approved: 15,
    rejected: 4,
  };

  let questionIndex = 0;
  
  Object.entries(statusDistribution).forEach(([status, count]) => {
    for (let i = 0; i < count; i++) {
      if (questionIndex >= demoQuestions.length) break;
      const question = demoQuestions[questionIndex++];
      reviews.push(createQuestionReview(question, status as QuestionReview['status']));
    }
  });

  return reviews;
}

export const demoReviews = generateDemoReviews();

// ==================== HELPER FONKSİYONLAR ====================

export function getReviewsByStatus(status: QuestionReview['status']): QuestionReview[] {
  return demoReviews.filter(r => r.status === status);
}

export function getReviewById(reviewId: string): QuestionReview | undefined {
  return demoReviews.find(r => r.id === reviewId);
}

export function getReviewByQuestionId(questionId: string): QuestionReview | undefined {
  return demoReviews.find(r => r.questionId === questionId);
}

export function getPendingReviews(): QuestionReview[] {
  return getReviewsByStatus('pending').sort((a, b) => {
    // Priority order
    const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

export function getMyReviews(reviewerName: string): QuestionReview[] {
  return demoReviews.filter(r => r.assignedTo === reviewerName);
}

export function getReviewStats() {
  const total = demoReviews.length;
  const pending = getReviewsByStatus('pending').length;
  const inReview = getReviewsByStatus('in_review').length;
  const needsRevision = getReviewsByStatus('needs_revision').length;
  const approved = getReviewsByStatus('approved').length;
  const rejected = getReviewsByStatus('rejected').length;

  const avgReviewTime = demoReviews
    .filter(r => r.reviewedAt && r.submittedAt)
    .map(r => {
      const submitted = new Date(r.submittedAt).getTime();
      const reviewed = new Date(r.reviewedAt!).getTime();
      return (reviewed - submitted) / (1000 * 60 * 60 * 24); // days
    })
    .reduce((sum, time, _, arr) => sum + time / arr.length, 0);

  return {
    total,
    pending,
    inReview,
    needsRevision,
    approved,
    rejected,
    avgReviewTime: Math.round(avgReviewTime * 10) / 10,
    approvalRate: total > 0 ? Math.round((approved / total) * 100) : 0,
  };
}

export function addComment(reviewId: string, comment: Omit<ReviewComment, 'id' | 'createdAt'>): void {
  const review = getReviewById(reviewId);
  if (review) {
    review.comments.push({
      id: generateUUID(),
      createdAt: new Date().toISOString(),
      ...comment,
    });
    review.history.push({
      id: generateUUID(),
      action: 'commented',
      userId: comment.userId,
      userName: comment.userName,
      timestamp: new Date().toISOString(),
      details: `Yorum eklendi: ${comment.type}`,
    });
  }
}

export function updateReviewStatus(
  reviewId: string,
  newStatus: QuestionReview['status'],
  userId: string,
  userName: string,
  details?: string
): void {
  const review = getReviewById(reviewId);
  if (review) {
    review.status = newStatus;
    
    const action = 
      newStatus === 'approved' ? 'approved' :
      newStatus === 'rejected' ? 'rejected' :
      newStatus === 'needs_revision' ? 'revision_requested' :
      newStatus === 'in_review' ? 'assigned' :
      'commented';

    if (newStatus === 'approved' || newStatus === 'rejected') {
      review.reviewedBy = userName;
      review.reviewedAt = new Date().toISOString();
    }

    review.history.push({
      id: generateUUID(),
      action: action as ReviewHistoryEntry['action'],
      userId,
      userName,
      timestamp: new Date().toISOString(),
      details: details || `Durum değiştirildi: ${newStatus}`,
    });
  }
}

