import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Globe, Mail, Database, Shield, Bell, Palette } from 'lucide-react';

// SuperAdmin - Portal Geneli Ayarlar
export default function PortalSettings() {
  const [settings, setSettings] = useState({
    // Genel
    platformName: 'Zerquiz',
    platformUrl: 'https://zerquiz.com',
    supportEmail: 'support@zerquiz.com',
    
    // Güvenlik
    passwordMinLength: 8,
    sessionTimeout: 30,
    twoFactorEnabled: true,
    ipWhitelistEnabled: false,
    
    // E-posta
    smtpServer: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUsername: 'noreply@zerquiz.com',
    emailFromName: 'Zerquiz Platform',
    
    // Database
    backupEnabled: true,
    backupFrequency: 'daily',
    retentionDays: 30,
    
    // Özellikler
    multiTenantEnabled: true,
    examModuleEnabled: true,
    royaltyModuleEnabled: true,
    presentationModuleEnabled: true,
    
    // Bildirimler
    systemNotificationsEnabled: true,
    emailNotificationsEnabled: true,
    smsNotificationsEnabled: false,
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Portal Ayarları</h1>
          <p className="text-gray-600 mt-1">Platform geneli sistem ayarları (SuperAdmin)</p>
        </div>
        <Badge variant="destructive" className="h-6">SuperAdmin Only</Badge>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">
            <Globe className="w-4 h-4 mr-2" />
            Genel
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="w-4 h-4 mr-2" />
            Güvenlik
          </TabsTrigger>
          <TabsTrigger value="email">
            <Mail className="w-4 h-4 mr-2" />
            E-posta
          </TabsTrigger>
          <TabsTrigger value="database">
            <Database className="w-4 h-4 mr-2" />
            Veritabanı
          </TabsTrigger>
          <TabsTrigger value="modules">
            <Palette className="w-4 h-4 mr-2" />
            Modüller
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="w-4 h-4 mr-2" />
            Bildirimler
          </TabsTrigger>
        </TabsList>

        {/* Genel Ayarlar */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Genel Platform Ayarları</CardTitle>
              <CardDescription>Tüm tenant'lar için geçerli temel ayarlar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="platformName">Platform Adı</Label>
                  <Input
                    id="platformName"
                    value={settings.platformName}
                    onChange={(e) => setSettings({...settings, platformName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="platformUrl">Platform URL</Label>
                  <Input
                    id="platformUrl"
                    value={settings.platformUrl}
                    onChange={(e) => setSettings({...settings, platformUrl: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="supportEmail">Destek E-posta</Label>
                <Input
                  id="supportEmail"
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => setSettings({...settings, supportEmail: e.target.value})}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">Multi-Tenant Modu</div>
                  <div className="text-sm text-gray-600">Birden fazla tenant desteği</div>
                </div>
                <Switch
                  checked={settings.multiTenantEnabled}
                  onCheckedChange={(checked) => setSettings({...settings, multiTenantEnabled: checked})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Güvenlik */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Güvenlik Ayarları</CardTitle>
              <CardDescription>Platform güvenlik politikaları</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="passwordMinLength">Minimum Parola Uzunluğu</Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    value={settings.passwordMinLength}
                    onChange={(e) => setSettings({...settings, passwordMinLength: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Oturum Zaman Aşımı (dakika)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => setSettings({...settings, sessionTimeout: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">İki Faktörlü Doğrulama</div>
                  <div className="text-sm text-gray-600">Tüm kullanıcılar için zorunlu</div>
                </div>
                <Switch
                  checked={settings.twoFactorEnabled}
                  onCheckedChange={(checked) => setSettings({...settings, twoFactorEnabled: checked})}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">IP Whitelist</div>
                  <div className="text-sm text-gray-600">Belirli IP'lerden erişim kısıtlama</div>
                </div>
                <Switch
                  checked={settings.ipWhitelistEnabled}
                  onCheckedChange={(checked) => setSettings({...settings, ipWhitelistEnabled: checked})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* E-posta */}
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>E-posta Sunucu Ayarları</CardTitle>
              <CardDescription>SMTP yapılandırması</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpServer">SMTP Sunucu</Label>
                  <Input
                    id="smtpServer"
                    value={settings.smtpServer}
                    onChange={(e) => setSettings({...settings, smtpServer: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">Port</Label>
                  <Input
                    id="smtpPort"
                    type="number"
                    value={settings.smtpPort}
                    onChange={(e) => setSettings({...settings, smtpPort: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtpUsername">Kullanıcı Adı</Label>
                <Input
                  id="smtpUsername"
                  value={settings.smtpUsername}
                  onChange={(e) => setSettings({...settings, smtpUsername: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emailFromName">Gönderen Adı</Label>
                <Input
                  id="emailFromName"
                  value={settings.emailFromName}
                  onChange={(e) => setSettings({...settings, emailFromName: e.target.value})}
                />
              </div>

              <Button variant="outline">Test E-postası Gönder</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Veritabanı */}
        <TabsContent value="database">
          <Card>
            <CardHeader>
              <CardTitle>Veritabanı & Yedekleme</CardTitle>
              <CardDescription>Otomatik yedekleme ayarları</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">Otomatik Yedekleme</div>
                  <div className="text-sm text-gray-600">Düzenli veritabanı yedeği</div>
                </div>
                <Switch
                  checked={settings.backupEnabled}
                  onCheckedChange={(checked) => setSettings({...settings, backupEnabled: checked})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="backupFrequency">Yedekleme Sıklığı</Label>
                <select
                  id="backupFrequency"
                  className="w-full border rounded-md p-2"
                  value={settings.backupFrequency}
                  onChange={(e) => setSettings({...settings, backupFrequency: e.target.value})}
                >
                  <option value="hourly">Saatlik</option>
                  <option value="daily">Günlük</option>
                  <option value="weekly">Haftalık</option>
                  <option value="monthly">Aylık</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="retentionDays">Yedek Saklama Süresi (gün)</Label>
                <Input
                  id="retentionDays"
                  type="number"
                  value={settings.retentionDays}
                  onChange={(e) => setSettings({...settings, retentionDays: parseInt(e.target.value)})}
                />
              </div>

              <div className="flex gap-2">
                <Button variant="outline">Şimdi Yedekle</Button>
                <Button variant="outline">Yedekleri Görüntüle</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Modüller */}
        <TabsContent value="modules">
          <Card>
            <CardHeader>
              <CardTitle>Platform Modülleri</CardTitle>
              <CardDescription>Aktif modülleri yönet</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">Sınav Modülü</div>
                  <div className="text-sm text-gray-600">Sınav oluşturma ve yönetimi</div>
                </div>
                <Switch
                  checked={settings.examModuleEnabled}
                  onCheckedChange={(checked) => setSettings({...settings, examModuleEnabled: checked})}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">Telif Modülü</div>
                  <div className="text-sm text-gray-600">Yazar telif hakları yönetimi</div>
                </div>
                <Switch
                  checked={settings.royaltyModuleEnabled}
                  onCheckedChange={(checked) => setSettings({...settings, royaltyModuleEnabled: checked})}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">Sunum Modülü</div>
                  <div className="text-sm text-gray-600">Canlı sunum ve interaktif içerik</div>
                </div>
                <Switch
                  checked={settings.presentationModuleEnabled}
                  onCheckedChange={(checked) => setSettings({...settings, presentationModuleEnabled: checked})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bildirimler */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Bildirim Ayarları</CardTitle>
              <CardDescription>Platform geneli bildirim kanalları</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">Sistem Bildirimleri</div>
                  <div className="text-sm text-gray-600">Uygulama içi bildirimler</div>
                </div>
                <Switch
                  checked={settings.systemNotificationsEnabled}
                  onCheckedChange={(checked) => setSettings({...settings, systemNotificationsEnabled: checked})}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">E-posta Bildirimleri</div>
                  <div className="text-sm text-gray-600">Otomatik e-posta gönderimi</div>
                </div>
                <Switch
                  checked={settings.emailNotificationsEnabled}
                  onCheckedChange={(checked) => setSettings({...settings, emailNotificationsEnabled: checked})}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">SMS Bildirimleri</div>
                  <div className="text-sm text-gray-600">SMS API entegrasyonu gerekli</div>
                </div>
                <Switch
                  checked={settings.smsNotificationsEnabled}
                  onCheckedChange={(checked) => setSettings({...settings, smsNotificationsEnabled: checked})}
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


