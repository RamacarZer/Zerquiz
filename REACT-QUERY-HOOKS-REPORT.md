# React Query Hooks - Implementation Report

## ✅ Tamamlanan İşler (19 Aralık 2025, 03:00)

### 📦 Oluşturulan Hook Dosyaları:

#### 1. **useContentQueries.tsx** ✅ (Güncellendi)
**Lokasyon**: `frontend/zerquiz-web/src/hooks/useContentQueries.tsx`

**Hooks**:
- `useContentList(tenantId, contentType?, page, pageSize)` - İçerik listesi
- `useContentDetail(id)` - Tek içerik detayı
- `useContentUpload()` - Dosya yükleme
- `useContentDelete()` - İçerik silme
- `useExtractText(id)` - PDF/DOCX text extraction
- **AI Generation Hooks**:
  - `useGenerateQuiz()` - Quiz üretimi
  - `useGenerateFlashcards()` - Flashcard üretimi
  - `useGenerateSummary()` - Özet çıkarma
  - `useGenerateWorksheet()` - Worksheet üretimi
  - `useGenerationJobStatus(jobId, enabled)` - Job polling (3s interval)
  - `useGeneratedContent(contentId, type?)` - Üretilen içerik listesi
  - `useApproveGenerated(id)` - İçerik onaylama

**Toplam**: 12 hook

---

#### 2. **useQuestionQueries.tsx** ✅ (Yeni)
**Lokasyon**: `frontend/zerquiz-web/src/hooks/useQuestionQueries.tsx`

**Hooks**:
- **CRUD Operations**:
  - `useQuestions(params)` - Filtrelenmiş soru listesi
  - `useQuestion(id)` - Tek soru detayı
  - `useCreateQuestion()` - Soru oluştur
  - `useUpdateQuestion()` - Soru güncelle
  - `useDeleteQuestion()` - Soru sil

- **Question Types (Backend Integration)**:
  - `useQuestionTypes()` - 65 soru tipi listesi
  - `useQuestionType(code)` - Tek tip detayı
  - `useQuestionTypeSchema(code)` - JSON schema

- **AI Generation**:
  - `useGenerateQuestionsWithAI(request)` - AI ile soru üretimi
  - `useBulkImportQuestions(questions)` - Toplu import

- **Metadata**:
  - `useFormatTypes()` - Format tipleri
  - `usePedagogicalTypes()` - Pedagojik tipler
  - `usePresentationTypes()` - Sunum tipleri
  - `useDifficultyLevels()` - Zorluk seviyeleri

- **Versions & Assets**:
  - `useQuestionVersions(questionId)` - Versiyon listesi
  - `useQuestionVersion(questionId, versionId)` - Tek versiyon
  - `useUploadAsset(file, versionId?, type?)` - Asset yükleme
  - `useAssetsByVersion(versionId)` - Versiyon asset'leri
  - `useDeleteAsset(assetId)` - Asset silme

**Toplam**: 19 hook

---

#### 3. **useLessonQueries.tsx** ✅ (Yeni - Scaffold)
**Lokasyon**: `frontend/zerquiz-web/src/hooks/useLessonQueries.tsx`

**Hooks** (Scaffold - TODO implementation):
- **Lesson Plans**:
  - `useLessonPlans(filters?)` - Plan listesi
  - `useLessonPlan(id)` - Tek plan
  - `useCreateLessonPlan()` - Plan oluştur
  - `useGenerateLessonPlanWithAI(request)` - AI plan üretimi

- **Templates**:
  - `useLessonTemplates()` - Template listesi

- **Assignments**:
  - `useAssignments(filters?)` - Ödev listesi
  - `useAssignment(id)` - Tek ödev
  - `useCreateAssignment()` - Ödev oluştur

- **Worksheets**:
  - `useWorksheets(filters?)` - Worksheet listesi
  - `useGenerateWorksheet(request)` - AI worksheet

**Toplam**: 10 hook (scaffold)

---

#### 4. **index.ts** ✅ (Yeni)
**Lokasyon**: `frontend/zerquiz-web/src/hooks/index.ts`

Tüm hooks'ları tek yerden export eden barrel file.

**Usage**:
```typescript
import { 
  useQuestions, 
  useQuestionTypes, 
  useGenerateQuiz,
  useContentList,
  useGenerateFlashcards 
} from '@/hooks';
```

---

## 📊 React Query Özellikleri

### Query Configuration:
```typescript
{
  staleTime: 5 * 60 * 1000,  // 5 dakika (lists)
  staleTime: 30 * 60 * 1000, // 30 dakika (metadata)
  refetchInterval: 3000,     // 3 saniye (job polling)
}
```

### Query Keys Stratejisi:
```typescript
// Hierarchical query keys for efficient invalidation
const questionKeys = {
  all: ['questions'],
  lists: () => [...questionKeys.all, 'list'],
  list: (filters) => [...questionKeys.lists(), { filters }],
  details: () => [...questionKeys.all, 'detail'],
  detail: (id) => [...questionKeys.details(), id],
};
```

### Auto-Invalidation:
- Mutation başarılı → İlgili query'ler otomatik yeniden fetch
- `queryClient.invalidateQueries()` kullanılıyor

### Polling:
- Job status hooks 3 saniyede bir kontrol ediyor
- `completed` veya `failed` olunca polling duruyor

---

## 🎯 Kullanım Örnekleri

### 1. Questions Page
```typescript
import { useQuestions, useQuestionTypes, useCreateQuestion } from '@/hooks';

function QuestionsPage() {
  const { data: questions, isLoading } = useQuestions({ 
    page: 1, 
    pageSize: 20,
    difficulty: 'medium'
  });
  
  const { data: questionTypes } = useQuestionTypes();
  const { mutate: createQuestion } = useCreateQuestion();

  const handleCreate = (formData) => {
    createQuestion(formData, {
      onSuccess: () => toast.success('Soru oluşturuldu'),
      onError: (error) => toast.error(error.message)
    });
  };

  // ...
}
```

### 2. Content Library with AI Generation
```typescript
import { 
  useContentList, 
  useGenerateQuiz, 
  useGenerationJobStatus 
} from '@/hooks';

function ContentLibrary() {
  const tenantId = localStorage.getItem('tenantId');
  const { data: contents } = useContentList(tenantId, 'pdf', 1, 20);
  
  const [jobId, setJobId] = useState(null);
  const { mutate: generateQuiz } = useGenerateQuiz();
  const { data: jobStatus } = useGenerationJobStatus(jobId, !!jobId);

  const handleGenerate = (contentId: string) => {
    generateQuiz({
      contentItemId: contentId,
      questionTypes: ['MULTIPLE_CHOICE'],
      difficulty: 'medium',
      count: 10,
      language: 'tr'
    }, {
      onSuccess: (response) => {
        setJobId(response.jobId);
        toast.success('Quiz üretimi başlatıldı');
      }
    });
  };

  useEffect(() => {
    if (jobStatus?.status === 'completed') {
      toast.success('Quiz hazır!');
      setJobId(null);
    }
  }, [jobStatus]);

  // ...
}
```

### 3. Bulk Question Import
```typescript
import { useBulkImportQuestions } from '@/hooks';

function ImportPage() {
  const { mutate: bulkImport, isPending } = useBulkImportQuestions();

  const handleImport = (csvData: any[]) => {
    const questions = parseCSV(csvData);
    
    bulkImport(questions, {
      onSuccess: (result) => {
        toast.success(`${result.successCount} soru eklendi`);
      },
      onError: (error) => {
        toast.error('Import başarısız');
      }
    });
  };

  // ...
}
```

---

## 📋 Sıradaki Adımlar

### 1. **Page Integration** (Sonraki Todo)
Ana sayfaları hooks'lara bağla:
- `QuestionsPage.tsx` → `useQuestions`, `useQuestionTypes`
- `ContentLibraryPage.tsx` → `useContentList`, `useGenerateQuiz`
- `LessonsPage.tsx` → `useLessonPlans`, `useGenerateLessonPlan`

### 2. **Error Handling**
Toast notifications ekle:
```typescript
import { toast } from 'react-toastify';

mutate(data, {
  onError: (error) => {
    toast.error(error.response?.data?.message || 'Bir hata oluştu');
  }
});
```

### 3. **Loading States**
Skeleton screens veya spinners:
```typescript
if (isLoading) return <QuestionsSkeleton />;
if (error) return <ErrorMessage error={error} />;
```

---

## 📊 İlerleme Özeti

**Backend**: 10/15 Todo (67%)
**Frontend**: 2/4 Todo (50%) ✅
- ✅ API Services
- ✅ React Query Hooks
- ⏳ Page Integration (Next)
- ⏳ Modal Fixes

**Toplam İlerleme**: 12/19 Todo (%63)

---

## ⚠️ Önemli Notlar

1. **Type Safety**: Tüm hooks TypeScript tiplerini kullanıyor
2. **Memoization**: Query keys JSON.stringify ile memoize ediliyor
3. **Polling**: Job status hooks otomatik polling yapıyor
4. **Stale Time**: Metadata 30dk, lists 5dk cache'leniyor
5. **Lessons Hooks**: Scaffold olarak hazır, API bağlandığında aktif edilecek

---

**Son Güncelleme**: 19 Aralık 2025, 03:00  
**Hazırlayan**: AI Assistant  
**Durum**: React Query Hooks ✅ Tamamlandı  
**Toplam Hooks**: 41 (12 Content + 19 Questions + 10 Lessons)

