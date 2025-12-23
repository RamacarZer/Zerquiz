# 🛡️ FAULT TOLERANCE & RESILIENCE ARCHITECTURE

## Genel Bakış

ZerQuiz platformu **fault-tolerant** ve **resilient** bir mimari kullanır. Bir modülde hata olduğunda diğer modüller etkilenmez ve sistem çalışmaya devam eder.

---

## 🏗️ Resilience Patterns

### 1. Circuit Breaker Pattern

**Ne yapar:** Sürekli başarısız olan servise istek göndermeyi durdurur, servisi dinlendirir.

**Ayarlar:**
- **3 ardışık hata** → Devre açılır
- **30 saniye bekleme** → Sonra tekrar denenir
- **Half-Open:** 1 test isteği gönderilir

**Örnek:**
```csharp
// Books servisi çöktü, 3 kez denendi
→ Circuit AÇILDI (30 saniye)
→ İstekler hemen fallback'e yönlendirilir
→ 30 saniye sonra tekrar denenir
```

### 2. Retry Pattern

**Ne yapar:** Geçici hatalarda (network timeout, 500 error) otomatik retry yapar.

**Ayarlar:**
- **3 retry** (üstel geri çekilme: 1s, 2s, 4s)
- Sadece **5xx** ve **timeout** hatalarında retry
- Her retry log'lanır

**Örnek:**
```csharp
// İstek timeout oldu
→ 1 saniye bekle, tekrar dene
→ Yine timeout → 2 saniye bekle
→ Yine timeout → 4 saniye bekle
→ Hala başarısız → Fallback'e geç
```

### 3. Timeout Pattern

**Ne yapar:** Takılan istekleri sonlandırır, sistem kitlenmesini engeller.

**Ayarlar:**
- **10 saniye** maksimum bekleme
- Pessimistic timeout (thread pool korunur)

### 4. Fallback Pattern

**Ne yapar:** Servis çalışmıyorsa varsayılan değer döner, sistem çalışmaya devam eder.

**Örnekler:**
- Dictionary servisi down → "Kelime bulunamadı" mesajı
- Books servisi down → Cached book list
- Reporting servisi down → "Rapor oluşturulamadı, lütfen sonra tekrar deneyin"

---

## 📡 Health Checks

Her servis **3 health check endpoint'i** sunar:

### 1. `/health` - Genel Sağlık
Tüm bağımlılıkları kontrol eder (DB, cache, dış API'ler)

**Response:**
```json
{
  "status": "Healthy",
  "timestamp": "2025-12-22T10:00:00Z",
  "duration": "00:00:00.150",
  "checks": [
    {
      "name": "database",
      "status": "Healthy",
      "description": "Database is healthy. Books count: 150",
      "duration": "00:00:00.120"
    },
    {
      "name": "self",
      "status": "Healthy",
      "description": "Books service is running"
    }
  ]
}
```

### 2. `/health/ready` - Hazır mı?
Servise trafik gönderilebilir mi? (Kubernetes readiness probe)

### 3. `/health/live` - Çalışıyor mu?
Servis ayakta mı, yoksa restart mi etmeli? (Kubernetes liveness probe)

---

## 🔄 Service Communication

### Servisler Arası İletişim Kuralları

**1. Asenkron Tercih Edilir**
- Mümkünse event-driven (message queue)
- Senkron HTTP gerekiyorsa → Resilient client kullan

**2. Timeout Her Zaman Var**
- Hiçbir istek sınırsız beklemez
- Default: 10 saniye

**3. Fallback Her Zaman Var**
- Servis down olduğunda ne yapılacağı bellidir
- Kullanıcıya anlamlı mesaj gösterilir

**4. İzolasyon**
- Her servis kendi veritabanı şemasını kullanır
- Shared database tablolarından kaçınılır
- Servisler birbirinin DB'sine direkt bağlanmaz

---

## 📋 Service Dependencies

### Books Service
**Bağımlılıklar:**
- PostgreSQL (books_schema) - **Kritik**
- Content Service (içerik alma) - **Opsiyonel**
- Curriculum Service (müfredat eşleştirme) - **Opsiyonel**

**Fallback Stratejisi:**
- Content Service down → İçerik havuzundan ekleme çalışmaz, manuel ekleme çalışır
- Curriculum Service down → Müfredat linki çalışmaz, diğer özellikler çalışır

### Dictionary Service
**Bağımlılıklar:**
- External APIs (Free Dictionary, TDK) - **Opsiyonel**

**Fallback Stratejisi:**
- External API down → Cached results döner
- Cache boş → "Kelime sözlükte bulunamadı" mesajı

### Reporting Service
**Bağımlılıklar:**
- Grading Service DB - **Kritik**
- Identity Service (kullanıcı bilgileri) - **Opsiyonel**
- Books Service (okuma istatistikleri) - **Opsiyonel**

**Fallback Stratejisi:**
- Bağımlı servis down → Mevcut datayı kullan
- Data yoksa → "Rapor oluşturulamıyor" mesajı

---

## 🚨 Error Handling

### API Hata Yanıtları

**Standard Error Format:**
```json
{
  "error": "Service temporarily unavailable",
  "code": "SERVICE_UNAVAILABLE",
  "timestamp": "2025-12-22T10:00:00Z",
  "serviceName": "books",
  "fallback": true,
  "retryAfter": 30
}
```

### HTTP Status Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | Success | Normal işlem |
| 503 | Service Unavailable | Circuit breaker açık, retry yok |
| 504 | Gateway Timeout | Retry edilebilir |
| 429 | Too Many Requests | Rate limit, exponential backoff |
| 500 | Internal Error | Retry edilebilir |

---

## 🎯 Monitoring & Alerting

### Metrics to Track

**Per Service:**
- Request rate (req/s)
- Error rate (%)
- Latency (p50, p95, p99)
- Circuit breaker status
- Retry count

**System-Wide:**
- Total requests
- Cross-service dependencies
- Failed requests by service
- Database connection pool status

### Alert Thresholds

| Metric | Warning | Critical |
|--------|---------|----------|
| Error Rate | > 5% | > 15% |
| Latency p95 | > 1s | > 5s |
| Circuit Breaker | Açık > 1 dakika | Açık > 5 dakika |
| Health Check | 2 başarısız | 5 başarısız |

---

## 🛠️ Implementation Examples

### 1. Resilient Service Call

```csharp
// ❌ YANLIŞ - Hata yönetimi yok
var response = await httpClient.GetAsync("http://books:5010/api/books");
var books = await response.Content.ReadAsAsync<List<Book>>();

// ✅ DOĞRU - Resilient client
var books = await resilientClient.GetAsync<List<Book>>(
    "http://books:5010/api/books",
    fallbackValue: new List<Book>() // Servis down olursa boş liste dön
);
```

### 2. Health Check Implementation

```csharp
// Her servise ekle
builder.Services.AddHealthChecks()
    .AddCheck<DatabaseHealthCheck>("database")
    .AddCheck("self", () => HealthCheckResult.Healthy());

app.MapHealthChecks("/health");
app.MapHealthChecks("/health/ready");
app.MapHealthChecks("/health/live");
```

### 3. Frontend Error Boundary

```tsx
// React Error Boundary - bir component hata verse diğerleri çalışır
class ErrorBoundary extends React.Component {
  componentDidCatch(error, info) {
    console.error('Component error:', error);
    // Fallback UI göster, tüm sayfa çökmesin
  }
}
```

---

## 🔧 Configuration

### appsettings.json

```json
{
  "Resilience": {
    "CircuitBreaker": {
      "FailureThreshold": 3,
      "DurationOfBreak": "00:00:30"
    },
    "Retry": {
      "RetryCount": 3,
      "BackoffPower": 2
    },
    "Timeout": {
      "RequestTimeout": "00:00:10"
    }
  },
  "HealthChecks": {
    "LivenessCheckInterval": "00:00:30",
    "ReadinessCheckInterval": "00:00:10"
  }
}
```

---

## 📊 Testing Resilience

### Chaos Engineering Tests

**1. Service Down Test**
```bash
# Books servisini kapat
docker stop books-service

# Test: Diğer servisler çalışmaya devam etmeli
curl http://localhost:5000/health  # Gateway healthy
curl http://localhost:5011/health  # Dictionary healthy
```

**2. Slow Response Test**
```bash
# Books servisine 5 saniyelik gecikme ekle
# Test: Timeout çalışmalı, sistem takılmamalı
```

**3. Database Connection Loss**
```bash
# PostgreSQL'i geçici durdur
# Test: Circuit breaker açılmalı, graceful degradation olmalı
```

---

## ✅ Resilience Checklist

Her yeni servis için:

- [ ] Health check endpoints ekle (`/health`, `/health/ready`, `/health/live`)
- [ ] Database bağlantısı için resilience policy
- [ ] Dış API çağrıları için circuit breaker
- [ ] Timeout konfigürasyonu (max 10s)
- [ ] Fallback değerleri tanımla
- [ ] Error logging (Serilog/Sentry)
- [ ] Monitoring metrics export
- [ ] Load testing (k6, JMeter)
- [ ] Chaos testing (service down scenarios)

---

## 🚀 Deployment Notes

### Kubernetes

```yaml
# Liveness probe
livenessProbe:
  httpGet:
    path: /health/live
    port: 8080
  initialDelaySeconds: 30
  periodSeconds: 10

# Readiness probe
readinessProbe:
  httpGet:
    path: /health/ready
    port: 8080
  initialDelaySeconds: 10
  periodSeconds: 5
```

### Docker Compose

```yaml
books-service:
  healthcheck:
    test: ["CMD", "curl", "-f", "http://localhost:5010/health/live"]
    interval: 30s
    timeout: 10s
    retries: 3
    start_period: 40s
```

---

## 📞 Troubleshooting

### Circuit Breaker Sürekli Açık
**Neden:** Servis sürekli başarısız oluyor  
**Çözüm:**
1. `/health` endpoint'ini kontrol et
2. Servis loglarına bak
3. Database bağlantısını test et
4. Resource limitlerini kontrol et (CPU, Memory)

### Yüksek Retry Rate
**Neden:** Servis yavaş veya intermittent hatalar  
**Çözüm:**
1. Latency metriklerine bak
2. Database query performance
3. Network issues kontrol et
4. Rate limiting ayarları

---

**Prepared by:** ZerQuiz Platform Team  
**Last Updated:** December 22, 2025  
**Version:** 1.0

