# 🚀 HIZLI BAŞLANGIÇ REHBERİ

## Kurulum

```bash
cd frontend/zerquiz-web
npm install
npm run dev
```

## Yeni Sayfalar

### Soru Editörü
**URL:** http://localhost:3000/questions/create

**Özellikler:**
- 5 adımlı wizard
- 8+ soru formatı
- KaTeX matematik (\( x^2 \), \[ \sum_{i=1}^n \])
- Medya yükleme
- Canlı önizleme

### Sunum Editörü
**URL:** http://localhost:3000/presentations/create

**Özellikler:**
- Google Slides benzeri
- 8 slide template
- 5 tema
- Drag & drop
- Speaker notes

### Sınav Oluşturma
**URL:** http://localhost:3000/exams/create

**Özellikler:**
- 4 adımlı wizard
- Soru bankasından seçim
- Karıştırma ayarları
- Kitapçık oluşturma

## Mock Data

Tüm veriler LocalStorage'da:
```javascript
zerquiz_mock_questions
zerquiz_mock_presentations
zerquiz_mock_exams
zerquiz_mock_question_format_types
zerquiz_mock_question_difficulty_levels
```

## Temizleme

```javascript
// Console'da:
localStorage.clear()
```

## Dosya Yapısı

```
src/
├── lib/            # Mock utilities
├── mocks/          # Mock data & services
├── components/
│   └── common/     # Reusable components
└── pages/          # Main pages
```

## Next Steps

1. ✅ npm install
2. ✅ npm run dev
3. Test sayfaları: /questions/create, /presentations/create, /exams/create
4. Backend entegrasyonu: Mock service'leri real API'ye çevir

🎉 Frontend hazır!

