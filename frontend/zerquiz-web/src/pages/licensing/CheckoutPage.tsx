import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { CreditCard, Lock, ArrowLeft, CheckCircle } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_YOUR_PUBLISHABLE_KEY'); // TODO: Move to env

interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
}

function CheckoutForm({ plan, billingCycle }: { plan: Plan; billingCycle: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [succeeded, setSucceeded] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    taxId: '',
    billingAddress: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // 1. Create payment intent
      const response = await fetch('http://localhost:5001/api/payment/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId: 'current-tenant-id', // TODO: Get from auth
          userId: 'current-user-id',
          licensePackageId: plan.id,
          amount: plan.price,
          currency: plan.currency,
          customerEmail: formData.email,
        }),
      });

      if (!response.ok) {
        throw new Error('Payment intent creation failed');
      }

      const { clientSecret } = await response.json();

      // 2. Confirm card payment
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              address: {
                line1: formData.billingAddress,
              },
            },
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message || 'Ödeme başarısız');
        setProcessing(false);
        return;
      }

      if (paymentIntent?.status === 'succeeded') {
        setSucceeded(true);
        setTimeout(() => {
          navigate('/billing/success');
        }, 2000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
      setProcessing(false);
    }
  };

  if (succeeded) {
    return (
      <div className="text-center py-12">
        <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Ödeme Başarılı!</h2>
        <p className="text-gray-600">Hesabınız aktifleştiriliyor...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Contact Info */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">İletişim Bilgileri</h3>
        
        <div>
          <label className="label">
            <span className="label-text">E-posta</span>
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="input input-bordered w-full"
            placeholder="ornek@mail.com"
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text">Ad Soyad / Firma Ünvanı</span>
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="input input-bordered w-full"
            placeholder="Ad Soyad"
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text">Telefon</span>
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="input input-bordered w-full"
            placeholder="+90 555 123 4567"
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text">Vergi No / TC No (Opsiyonel)</span>
          </label>
          <input
            type="text"
            value={formData.taxId}
            onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
            className="input input-bordered w-full"
            placeholder="1234567890"
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text">Fatura Adresi</span>
          </label>
          <textarea
            value={formData.billingAddress}
            onChange={(e) => setFormData({ ...formData, billingAddress: e.target.value })}
            className="textarea textarea-bordered w-full"
            rows={3}
            placeholder="Fatura adresi..."
          />
        </div>
      </div>

      {/* Card Info */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Kart Bilgileri</h3>
        <div className="p-4 border border-gray-300 rounded-lg">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Lock size={16} />
          <span>Ödeme bilgileriniz güvenli bir şekilde şifrelenir</span>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="btn btn-primary w-full btn-lg"
      >
        {processing ? (
          <>
            <span className="loading loading-spinner"></span>
            İşleniyor...
          </>
        ) : (
          <>
            <CreditCard size={20} />
            {plan.price} {plan.currency} Öde
          </>
        )}
      </button>

      <p className="text-xs text-gray-500 text-center">
        Ödeme yaparak{' '}
        <a href="/terms" className="link">
          Kullanım Şartları
        </a>{' '}
        ve{' '}
        <a href="/privacy" className="link">
          Gizlilik Politikası
        </a>
        'nı kabul etmiş olursunuz.
      </p>
    </form>
  );
}

export default function CheckoutPage() {
  const { planId } = useParams<{ planId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [plan, setPlan] = useState<Plan | null>(null);
  const billingCycle = searchParams.get('cycle') || 'monthly';

  useEffect(() => {
    // Mock plan data - in production, fetch from API
    const mockPlans: Record<string, Plan> = {
      basic: {
        id: 'basic',
        name: 'Temel',
        price: billingCycle === 'monthly' ? 99 : 990,
        currency: 'TRY',
      },
      pro: {
        id: 'pro',
        name: 'Profesyonel',
        price: billingCycle === 'monthly' ? 299 : 2990,
        currency: 'TRY',
      },
    };

    if (planId && mockPlans[planId]) {
      setPlan(mockPlans[planId]);
    }
  }, [planId, billingCycle]);

  if (!plan) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <button
          onClick={() => navigate('/plans')}
          className="btn btn-ghost gap-2 mb-6"
        >
          <ArrowLeft size={18} />
          Planlara Dön
        </button>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ödeme</h1>
          <p className="text-gray-600 mb-8">Güvenli ödeme ile hemen başlayın</p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <div className="card bg-white shadow-xl">
                <div className="card-body">
                  <Elements stripe={stripePromise}>
                    <CheckoutForm plan={plan} billingCycle={billingCycle} />
                  </Elements>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="card bg-white shadow-xl sticky top-6">
                <div className="card-body">
                  <h3 className="card-title">Sipariş Özeti</h3>
                  
                  <div className="divider"></div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Plan</span>
                      <span className="font-semibold">{plan.name}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Dönem</span>
                      <span className="font-semibold">
                        {billingCycle === 'monthly' ? 'Aylık' : 'Yıllık'}
                      </span>
                    </div>

                    <div className="divider"></div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Ara Toplam</span>
                      <span>{plan.price} {plan.currency}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">KDV (%20)</span>
                      <span>{(plan.price * 0.2).toFixed(2)} {plan.currency}</span>
                    </div>

                    <div className="divider"></div>

                    <div className="flex justify-between text-lg font-bold">
                      <span>Toplam</span>
                      <span>{(plan.price * 1.2).toFixed(2)} {plan.currency}</span>
                    </div>
                  </div>

                  <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700">
                      ✓ 14 gün ücretsiz deneme<br />
                      ✓ İstediğiniz zaman iptal<br />
                      ✓ Güvenli ödeme
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

