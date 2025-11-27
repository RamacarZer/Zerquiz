import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Building2, Palette, Users, Lock, Bell, CreditCard } from 'lucide-react';

// Tenant Admin - Kendi Kurumunun Ayarları
export default function OrganizationSettings() {
  const [settings, setSettings] = useState({
    // Kurum Bilgileri
    organizationName: 'Demo Okul',
    organizationCode: 'DEMO-001',
    address: 'Ankara, Türkiye',
    phone: '+90 312 XXX XX XX',
    email: 'info@demookul.com',
    website: 'https://demookul.com',
    
    // Branding
    logoUrl: '',
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
    customDomain: 'demookul.zerquiz.com',
    
    // Özellikler (Lisansa göre)
    maxUsers: 100,
    maxQuestions: 1000,
    maxExams: 50,
    storageQuota: 10, // GB
    
    // Kullanıcı Ayarları
    allowSelfRegistration: false,
    requireEmailVerification: true,
    defaultUserRole: 'student',
    
    // Bildirimler
    notifyNewUser: true,
    notifyExamSubmit: true,
    notifyNewQuestion: false,
  });

  // Mock license info
  const licenseInfo = {
    plan: 'Professional',
    status: 'active',
    expiryDate: '2025-12-31',
    features: ['Sınırsız Soru', '100 Kullanıcı', 'API Erişimi', 'Özel Branding']
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kurumsal Ayarlar</h1>
          <p className="text-gray-600 mt-1">Kendi kurumunuzun ayarlarını yönetin</p>
        </div>
        <Badge className="h-6">{licenseInfo.plan}</Badge>
      </div>

      {/* License Summary */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-sm text-gray-600">Mevcut Lisans</div>
              <div className="text-2xl font-bold text-gray-900">{licenseInfo.plan} Plan</div>
              <div className="text-sm text-gray-600">
                Geçerlilik: <span className="font-medium">{licenseInfo.expiryDate}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="space-y-1">
                {licenseInfo.features.map((feature, idx) => (
                  <div key={idx} className="text-sm text-gray-700">✓ {feature}</div>
                ))}
              </div>
              <Button variant="outline" className="mt-3" size="sm">Lisansı Yükselt</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="organization" className="space-y-6">
        <TabsList>
          <TabsTrigger value="organization">
            <Building2 className="w-4 h-4 mr-2" />
            Kurum Bilgileri
          </TabsTrigger>
          <TabsTrigger value="branding">
            <Palette className="w-4 h-4 mr-2" />
            Marka & Görünüm
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="w-4 h-4 mr-2" />
            Kullanıcı Ayarları
          </TabsTrigger>
          <TabsTrigger value="quota">
            <CreditCard className="w-4 h-4 mr-2" />
            Kota Kullanımı
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="w-4 h-4 mr-2" />
            Bildirimler
          </TabsTrigger>
        </TabsList>

        {/* Kurum Bilgileri */}
        <TabsContent value="organization">
          <Card>
            <CardHeader>
              <CardTitle>Kurum Bilgileri</CardTitle>
              <CardDescription>Kurumunuzun genel bilgileri</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="orgName">Kurum Adı</Label>
                  <Input
                    id="orgName"
                    value={settings.organizationName}
                    onChange={(e) => setSettings({...settings, organizationName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orgCode">Kurum Kodu</Label>
                  <Input
                    id="orgCode"
                    value={settings.organizationCode}
                    disabled
                    className="bg-gray-100"
                  />
                  <p className="text-xs text-gray-500">Kurum kodu değiştirilemez</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Adres</Label>
                <Textarea
                  id="address"
                  value={settings.address}
                  onChange={(e) => setSettings({...settings, address: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon</Label>
                  <Input
                    id="phone"
                    value={settings.phone}
                    onChange={(e) => setSettings({...settings, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-posta</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({...settings, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={settings.website}
                    onChange={(e) => setSettings({...settings, website: e.target.value})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Branding */}
        <TabsContent value="branding">
          <Card>
            <CardHeader>
              <CardTitle>Marka & Görünüm</CardTitle>
              <CardDescription>Logo, renkler ve özel domain</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="logo">Kurum Logosu</Label>
                <div className="flex items-center gap-4">
                  <div className="w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center">
                    {settings.logoUrl ? (
                      <img src={settings.logoUrl} alt="Logo" className="max-w-full max-h-full" />
                    ) : (
                      <span className="text-gray-400">Logo</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <Button variant="outline">Logo Yükle</Button>
                    <p className="text-sm text-gray-500 mt-2">
                      Önerilen boyut: 200x200px, Max 2MB
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Ana Renk</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                      className="w-20"
                    />
                    <Input
                      value={settings.primaryColor}
                      onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">İkincil Renk</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={settings.secondaryColor}
                      onChange={(e) => setSettings({...settings, secondaryColor: e.target.value})}
                      className="w-20"
                    />
                    <Input
                      value={settings.secondaryColor}
                      onChange={(e) => setSettings({...settings, secondaryColor: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customDomain">Özel Domain</Label>
                <Input
                  id="customDomain"
                  value={settings.customDomain}
                  onChange={(e) => setSettings({...settings, customDomain: e.target.value})}
                />
                <p className="text-sm text-gray-500">
                  Professional plan ve üstü için mevcut
                </p>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="font-medium text-blue-900 mb-2">Önizleme</div>
                <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 rounded" style={{backgroundColor: settings.primaryColor}}></div>
                  <div className="w-16 h-16 rounded" style={{backgroundColor: settings.secondaryColor}}></div>
                  <div className="text-sm text-gray-600">Seçilen renkler uygulamada bu şekilde görünecek</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Kullanıcı Ayarları */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Kullanıcı Yönetimi Ayarları</CardTitle>
              <CardDescription>Kullanıcı kaydı ve yetkilendirme</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">Kendi Kendine Kayıt</div>
                  <div className="text-sm text-gray-600">Kullanıcılar kendi hesaplarını oluşturabilir</div>
                </div>
                <Switch
                  checked={settings.allowSelfRegistration}
                  onCheckedChange={(checked) => setSettings({...settings, allowSelfRegistration: checked})}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">E-posta Doğrulama</div>
                  <div className="text-sm text-gray-600">Yeni kullanıcılar e-posta doğrulamalı</div>
                </div>
                <Switch
                  checked={settings.requireEmailVerification}
                  onCheckedChange={(checked) => setSettings({...settings, requireEmailVerification: checked})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultRole">Varsayılan Rol</Label>
                <select
                  id="defaultRole"
                  className="w-full border rounded-md p-2"
                  value={settings.defaultUserRole}
                  onChange={(e) => setSettings({...settings, defaultUserRole: e.target.value})}
                >
                  <option value="student">Öğrenci</option>
                  <option value="teacher">Öğretmen</option>
                  <option value="observer">Gözlemci</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Kota Kullanımı */}
        <TabsContent value="quota">
          <Card>
            <CardHeader>
              <CardTitle>Kota Kullanımı</CardTitle>
              <CardDescription>Lisans limitler ve mevcut kullanım</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Kullanıcılar</span>
                  <span className="font-medium">68 / {settings.maxUsers}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: '68%'}}></div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Sorular</span>
                  <span className="font-medium">543 / {settings.maxQuestions}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{width: '54%'}}></div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Sınavlar</span>
                  <span className="font-medium">23 / {settings.maxExams}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{width: '46%'}}></div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Depolama Alanı</span>
                  <span className="font-medium">6.3 GB / {settings.storageQuota} GB</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-600 h-2 rounded-full" style={{width: '63%'}}></div>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="text-sm text-yellow-900">
                  <strong>Not:</strong> Kotanızı aşmak üzereyseniz, lütfen lisansınızı yükseltin.
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bildirimler */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Bildirim Tercihleri</CardTitle>
              <CardDescription>Kurum yöneticileri için bildirimler</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">Yeni Kullanıcı Kaydı</div>
                  <div className="text-sm text-gray-600">Yeni kullanıcı kaydında bildirim</div>
                </div>
                <Switch
                  checked={settings.notifyNewUser}
                  onCheckedChange={(checked) => setSettings({...settings, notifyNewUser: checked})}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">Sınav Teslimi</div>
                  <div className="text-sm text-gray-600">Sınav teslim edildiğinde bildirim</div>
                </div>
                <Switch
                  checked={settings.notifyExamSubmit}
                  onCheckedChange={(checked) => setSettings({...settings, notifyExamSubmit: checked})}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">Yeni Soru Ekleme</div>
                  <div className="text-sm text-gray-600">Yeni soru eklendiğinde bildirim</div>
                </div>
                <Switch
                  checked={settings.notifyNewQuestion}
                  onCheckedChange={(checked) => setSettings({...settings, notifyNewQuestion: checked})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button variant="outline">İptal</Button>
        <Button>Değişiklikleri Kaydet</Button>
      </div>
    </div>
  );
}


