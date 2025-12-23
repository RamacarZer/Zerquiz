import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, Crown, Building2, Users, Zap } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billingPeriod: string;
  features: string[];
  recommended?: boolean;
}

export default function PlansPage() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    // Mock plans - in production, fetch from API
    const mockPlans: Plan[] = [
      {
        id: 'basic',
        name: 'Temel',
        description: 'Bireysel kullanım için ideal',
        price: billingCycle === 'monthly' ? 99 : 990,
        currency: 'TRY',
        billingPeriod: billingCycle,
        features: [
          '5 kitap erişimi',
          'Temel okuyucu özellikleri',
          'TTS (Sesli okuma)',
          'Kelime defteri',
          'E-posta desteği',
        ],
      },
      {
        id: 'pro',
        name: 'Profesyonel',
        description: 'Öğretmenler ve küçük okullar için',
        price: billingCycle === 'monthly' ? 299 : 2990,
        currency: 'TRY',
        billingPeriod: billingCycle,
        recommended: true,
        features: [
          '50 kitap erişimi',
          'Tüm okuyucu özellikleri',
          'Smartboard modu',
          'Sınıf yönetimi',
          'İlerleme takibi',
          'Özel raporlar',
          'Öncelikli destek',
        ],
      },
      {
        id: 'enterprise',
        name: 'Kurumsal',
        description: 'Büyük okullar ve yayınevleri için',
        price: 0, // Custom pricing
        currency: 'TRY',
        billingPeriod: 'custom',
        features: [
          'Sınırsız kitap erişimi',
          'Özel içerik yükleme',
          'AI içerik üretimi',
          'Çoklu okul yönetimi',
          'API erişimi',
          'Özel entegrasyonlar',
          'SLA garantisi',
          '7/24 destek',
        ],
      },
    ];

    setPlans(mockPlans);
    setLoading(false);
  }, [billingCycle]);

  const handleSelectPlan = (planId: string) => {
    navigate(`/checkout/${planId}?cycle=${billingCycle}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Size Uygun Planı Seçin
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            ZerQuiz ile eğitimin geleceğini deneyimleyin
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 bg-white rounded-full p-2 shadow-md">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full font-medium transition ${
                billingCycle === 'monthly'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Aylık
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-full font-medium transition relative ${
                billingCycle === 'yearly'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yıllık
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                %15 İndirim
              </span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl shadow-xl overflow-hidden transition-transform hover:scale-105 ${
                plan.recommended ? 'ring-4 ring-blue-500' : ''
              }`}
            >
              {plan.recommended && (
                <div className="absolute top-0 right-0 bg-blue-500 text-white px-6 py-1 text-sm font-semibold">
                  ÖNERİLEN
                </div>
              )}

              <div className="p-8">
                {/* Icon */}
                <div className="mb-4">
                  {plan.id === 'basic' && (
                    <Users size={48} className="text-blue-600" />
                  )}
                  {plan.id === 'pro' && (
                    <Crown size={48} className="text-yellow-500" />
                  )}
                  {plan.id === 'enterprise' && (
                    <Building2 size={48} className="text-purple-600" />
                  )}
                </div>

                {/* Plan Name */}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>

                {/* Price */}
                <div className="mb-6">
                  {plan.price > 0 ? (
                    <>
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-bold text-gray-900">
                          {plan.price}
                        </span>
                        <span className="text-xl text-gray-600">₺</span>
                      </div>
                      <p className="text-gray-500 mt-1">
                        / {billingCycle === 'monthly' ? 'ay' : 'yıl'}
                      </p>
                    </>
                  ) : (
                    <div>
                      <span className="text-3xl font-bold text-gray-900">
                        Özel Fiyatlandırma
                      </span>
                      <p className="text-gray-500 mt-1">İletişime geçin</p>
                    </div>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full py-3 rounded-lg font-semibold transition ${
                    plan.recommended
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.price > 0 ? 'Hemen Başla' : 'İletişime Geç'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Sık Sorulan Sorular
          </h2>
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-semibold text-gray-900 mb-2">
                Planımı dilediğim zaman değiştirebilir miyim?
              </h3>
              <p className="text-gray-600">
                Evet, istediğiniz zaman planınızı yükseltebilir veya düşürebilirsiniz.
                Ücret farkı otomatik hesaplanır.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-semibold text-gray-900 mb-2">
                Ücretsiz deneme süresi var mı?
              </h3>
              <p className="text-gray-600">
                Evet, tüm planlar için 14 gün ücretsiz deneme sunuyoruz. Kredi kartı
                bilgisi gerekmez.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-semibold text-gray-900 mb-2">
                İptal politikanız nedir?
              </h3>
              <p className="text-gray-600">
                İstediğiniz zaman iptal edebilirsiniz. Kalan süreniz için geri ödeme
                yapılır.
              </p>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">Güvenli ödeme ile</p>
          <div className="flex justify-center items-center gap-6">
            <div className="bg-white px-6 py-3 rounded-lg shadow-md">
              <span className="font-semibold text-gray-700">Stripe</span>
            </div>
            <div className="bg-white px-6 py-3 rounded-lg shadow-md">
              <span className="font-semibold text-gray-700">iyzico</span>
            </div>
            <div className="bg-white px-6 py-3 rounded-lg shadow-md">
              <span className="font-semibold text-gray-700">SSL Güvenli</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

