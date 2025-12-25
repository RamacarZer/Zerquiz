import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, Crown, Building2, Users, Zap, Star, Shield, TrendingUp, Award, Sparkles } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billingPeriod: string;
  features: string[];
  recommended?: boolean;
  icon: string;
  gradient: string;
  badge?: string;
}

export default function PlansPage() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

  useEffect(() => {
    // Mock plans - in production, fetch from API
    const mockPlans: Plan[] = [
      {
        id: 'basic',
        name: 'Temel',
        description: 'Bireysel kullanım ve küçük sınıflar için ideal başlangıç paketi',
        price: billingCycle === 'monthly' ? 99 : 990,
        currency: 'TRY',
        billingPeriod: billingCycle,
        icon: 'users',
        gradient: 'from-blue-500 to-cyan-500',
        features: [
          '5 kitap erişimi',
          'Temel okuyucu özellikleri',
          'TTS (Sesli okuma)',
          'Kelime defteri (100 kelime)',
          'Temel raporlama',
          'E-posta desteği',
          '1 GB dosya depolama',
        ],
      },
      {
        id: 'pro',
        name: 'Profesyonel',
        description: 'Öğretmenler ve orta ölçekli eğitim kurumları için',
        price: billingCycle === 'monthly' ? 299 : 2990,
        currency: 'TRY',
        billingPeriod: billingCycle,
        recommended: true,
        icon: 'crown',
        gradient: 'from-purple-500 to-pink-500',
        badge: 'En Popüler',
        features: [
          '50 kitap erişimi',
          'Tüm okuyucu özellikleri',
          'Smartboard entegrasyonu',
          'Sınıf yönetimi (100 öğrenci)',
          'İlerleme takibi ve analitik',
          'Özelleştirilebilir raporlar',
          'AI destekli soru üretimi (100 soru/ay)',
          'Öncelikli e-posta desteği',
          '10 GB dosya depolama',
          'Haftalık performans raporları',
        ],
      },
      {
        id: 'enterprise',
        name: 'Kurumsal',
        description: 'Büyük okullar, üniversiteler ve yayınevleri için',
        price: 0, // Custom pricing
        currency: 'TRY',
        billingPeriod: 'custom',
        icon: 'building',
        gradient: 'from-orange-500 to-red-500',
        badge: 'Özel Fiyat',
        features: [
          'Sınırsız kitap erişimi',
          'Özel içerik yükleme',
          'AI içerik üretimi (Sınırsız)',
          'Çoklu okul/kampüs yönetimi',
          'Tam API erişimi',
          'Özel entegrasyonlar',
          'LMS entegrasyonu (Canvas, Moodle)',
          'SLA garantisi (%99.9 uptime)',
          '7/24 öncelikli destek',
          'Sınırsız depolama',
          'Özel eğitim ve onboarding',
          'Yerinde kurulum desteği',
        ],
      },
    ];

    setPlans(mockPlans);
    setLoading(false);
  }, [billingCycle]);

  const handleSelectPlan = (planId: string) => {
    if (planId === 'enterprise') {
      // Contact form for enterprise
      window.location.href = 'mailto:sales@zerquiz.com?subject=Kurumsal Plan Talebi';
    } else {
      navigate(`/licensing/checkout?plan=${planId}&cycle=${billingCycle}`);
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'crown':
        return <Crown className="w-8 h-8" />;
      case 'building':
        return <Building2 className="w-8 h-8" />;
      default:
        return <Users className="w-8 h-8" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Planlar yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Özel Fiyatlar</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
            Size Uygun Planı Seçin
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Eğitimde yeni nesil dijital deneyim. Kitaplar, AI destekli içerik ve akıllı öğrenme araçları bir arada.
          </p>
          
          {/* Billing Cycle Toggle */}
          <div className="inline-flex items-center bg-white shadow-lg rounded-full p-1.5 border-2 border-gray-200">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                billingCycle === 'monthly'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Aylık
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 relative ${
                billingCycle === 'yearly'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yıllık
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                %17 İndirim
              </span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div
              key={plan.id}
              onMouseEnter={() => setHoveredPlan(plan.id)}
              onMouseLeave={() => setHoveredPlan(null)}
              className={`relative rounded-3xl bg-white shadow-xl transition-all duration-300 ${
                plan.recommended
                  ? 'ring-4 ring-purple-500 transform scale-105 z-10'
                  : 'hover:shadow-2xl hover:-translate-y-2'
              }`}
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'fadeInUp 0.6s ease-out forwards',
              }}
            >
              {/* Badge */}
              {plan.badge && (
                <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r ${plan.gradient} text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2`}>
                  <Star className="w-4 h-4 fill-current" />
                  {plan.badge}
                </div>
              )}

              <div className="p-8">
                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-r ${plan.gradient} rounded-2xl flex items-center justify-center text-white mb-6 transform transition-transform duration-300 ${
                  hoveredPlan === plan.id ? 'scale-110 rotate-6' : ''
                }`}>
                  {getIcon(plan.icon)}
                </div>

                {/* Plan Name */}
                <h3 className="text-3xl font-bold text-gray-900 mb-3">{plan.name}</h3>
                <p className="text-gray-600 mb-6 h-12">{plan.description}</p>

                {/* Price */}
                <div className="mb-8">
                  {plan.price === 0 ? (
                    <div>
                      <p className="text-4xl font-extrabold text-gray-900 mb-2">Özel Fiyat</p>
                      <p className="text-sm text-gray-500">İhtiyaçlarınıza göre</p>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-extrabold text-gray-900">{plan.price}</span>
                        <span className="text-2xl font-bold text-gray-600">₺</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        {billingCycle === 'monthly' ? '/ay' : '/yıl'}
                        {billingCycle === 'yearly' && (
                          <span className="ml-2 text-green-600 font-semibold">
                            (Aylık {Math.round(plan.price / 12)}₺)
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 mb-8 ${
                    plan.recommended
                      ? `bg-gradient-to-r ${plan.gradient} text-white shadow-lg hover:shadow-xl transform hover:scale-105`
                      : 'bg-gray-900 text-white hover:bg-gray-800 shadow-md hover:shadow-lg'
                  }`}
                >
                  {plan.price === 0 ? 'İletişime Geç' : 'Hemen Başla'}
                </button>

                {/* Features */}
                <div className="space-y-4">
                  <p className="text-sm font-bold text-gray-900 uppercase tracking-wide">Özellikler:</p>
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Detaylı Karşılaştırma</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-6 font-bold text-gray-900">Özellik</th>
                  {plans.map((plan) => (
                    <th key={plan.id} className="text-center py-4 px-6 font-bold text-gray-900">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-4 px-6 font-medium text-gray-700">Kitap Erişimi</td>
                  <td className="py-4 px-6 text-center">5 kitap</td>
                  <td className="py-4 px-6 text-center">50 kitap</td>
                  <td className="py-4 px-6 text-center">Sınırsız</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="py-4 px-6 font-medium text-gray-700">AI Soru Üretimi</td>
                  <td className="py-4 px-6 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                  <td className="py-4 px-6 text-center">100/ay</td>
                  <td className="py-4 px-6 text-center">Sınırsız</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-gray-700">Smartboard Desteği</td>
                  <td className="py-4 px-6 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                  <td className="py-4 px-6 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="py-4 px-6 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="py-4 px-6 font-medium text-gray-700">Depolama</td>
                  <td className="py-4 px-6 text-center">1 GB</td>
                  <td className="py-4 px-6 text-center">10 GB</td>
                  <td className="py-4 px-6 text-center">Sınırsız</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-gray-700">API Erişimi</td>
                  <td className="py-4 px-6 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                  <td className="py-4 px-6 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                  <td className="py-4 px-6 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="py-4 px-6 font-medium text-gray-700">Destek</td>
                  <td className="py-4 px-6 text-center">E-posta</td>
                  <td className="py-4 px-6 text-center">Öncelikli</td>
                  <td className="py-4 px-6 text-center">7/24</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl shadow-xl p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Hala Kararsız mısınız?</h2>
          <p className="text-lg mb-8 opacity-90">
            Size en uygun planı seçmenize yardımcı olmak için buradayız.
          </p>
          <button className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl">
            Bizimle İletişime Geçin
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}
