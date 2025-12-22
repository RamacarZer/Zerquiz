# Zercode Whiteboard Suite - Quick Start Guide

## 🚀 Başlatma

```bash
cd frontend/zerquiz-web
npm run dev
```

## 📍 Erişim Yolları

### 1. URL ile:
```
http://localhost:3001/whiteboard-suite
```

### 2. Menu ile:
```
Dashboard → Araçlar → Zercode Whiteboard Suite
```

## 🎨 Modlar

### Beyaz Tahta (Excalidraw)
- Serbest çizim
- Geometrik şekiller
- Ok ve çizgiler
- Metin ekleme
- SVG/PNG export

### Sunum (Polotno)
- Çoklu sayfa
- Şablon sistemi
- Text, şekiller, resimler
- PDF export

### PDF Annotator
- PDF üzerine not alma
- Kalem ve işaretleyici
- Sayfa navigasyonu
- Zoom kontrolü

## 🛠️ Araçlar

1. **Select** - Seçim aracı
2. **Pen** - Kalem (serbest çizim)
3. **Eraser** - Silgi
4. **Line** - Düz çizgi
5. **Arrow** - Ok
6. **Rectangle** - Dikdörtgen
7. **Circle** - Daire
8. **Text** - Metin
9. **Highlighter** - İşaretleyici (sadece PDF'de)
10. **Sticky** - Yapışkan not

## 🎨 Renk Paleti

12 önceden tanımlı renk:
- Siyah, Beyaz, Kırmızı, Yeşil
- Mavi, Sarı, Magenta, Cyan
- Turuncu, Mor, Gri, Açık Mavi

## 📏 Çizgi Kalınlıkları

6 farklı kalınlık: 1px, 2px, 3px, 5px, 8px, 12px

## 💾 Kaydetme

- **Otomatik kayıt**: 700ms debounce ile otomatik
- **Manuel kayıt**: Header'daki "Kaydet" butonu
- **Son kayıt**: Header'da gösterilir

## 📤 Export

### Excalidraw:
- PNG
- SVG
- JSON

### Polotno:
- PDF
- PNG (per page)
- JSON

### PDF Annotator:
- PNG (current page)
- JSON (annotations)

## 🔧 Teknik Detaylar

### Teknoloji Stack:
- React + TypeScript
- Excalidraw
- Polotno
- React-PDF + PDF.js
- Zustand (state management)

### Dosya Yapısı:
```
src/
├── whiteboard/
│   ├── core/
│   │   ├── engineTypes.ts
│   │   ├── modeStore.ts
│   │   └── api.ts
│   ├── engines/
│   │   ├── excalidraw/
│   │   ├── polotno/
│   │   └── pdf/
│   ├── shell/
│   │   ├── ZercodeWhiteboardShell.tsx
│   │   ├── Header.tsx
│   │   ├── Toolbar.tsx
│   │   └── ModeSwitch.tsx
│   └── styles/
│       └── whiteboard.css
├── pages/
│   └── whiteboard/
│       └── WhiteboardPage.tsx
└── components/
    └── editors/
        └── MathEditorEnhanced.tsx
```

## 🐛 Troubleshooting

### PDF görünmüyor:
1. `public/sample.pdf` dosyasını ekleyin
2. Veya online PDF URL'i kullanın

### Polotno lisans hatası:
- Polotno ücretsiz versiyonda watermark gösterir
- License key için: `polotnoEngine.ts` → `createStore({ key: '...' })`

### CSS yüklenmiyor:
- `whiteboard.css` import edilmiş mi kontrol edin
- Tarayıcı cache'ini temizleyin (Ctrl+Shift+R)

## 📝 Notlar

- Tüm veriler mock olarak çalışır
- Gerçek DB entegrasyonu için `api.ts` güncelleyin
- Auto-save 700ms debounce ile çalışır
- Multi-user collaboration v2'de gelecek

## 🎉 Özellikler

✅ 3 farklı engine (Excalidraw, Polotno, PDF)
✅ 10 çizim aracı
✅ 12 renk paleti
✅ 6 kalınlık seçeneği
✅ Auto-save
✅ Export (PNG/SVG/PDF/JSON)
✅ Undo/Redo
✅ Responsive design
✅ Mode switching

## 📞 Destek

Sorun yaşarsanız:
1. Console'u kontrol edin (F12)
2. Linter hatalarını kontrol edin
3. Build yapın: `npm run build`

Başarılar! 🚀





