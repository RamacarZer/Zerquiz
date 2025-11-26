import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Globe, Palette, Check, X } from 'lucide-react';
import { api } from '@/lib/api';

interface TenantConfig {
  id: string;
  name: string;
  domain: string;
  customDomain?: string;
  customDomainVerified: boolean;
  isActive: boolean;
}

interface Branding {
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  favicon: string;
  customCss: string;
}

export default function TenantSettings() {
  const [config, setConfig] = useState<TenantConfig | null>(null);
  const [branding, setBranding] = useState<Branding>({
    logo: '',
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
    favicon: '',
    customCss: ''
  });
  const [customDomain, setCustomDomain] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const tenantId = localStorage.getItem('tenantId') || '1';
      const [configRes, brandingRes] = await Promise.all([
        api.get(`/core/tenant-config/${tenantId}`),
        api.get(`/core/tenant-config/${tenantId}/branding`)
      ]);

      setConfig(configRes.data);
      setBranding(brandingRes.data);
      setCustomDomain(configRes.data.customDomain || '');
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const setDomain = async () => {
    if (!config || !customDomain.trim()) return;

    try {
      await api.post(`/core/tenant-config/${config.id}/custom-domain`, {
        customDomain
      });
      alert('Custom domain configured! Please add the DNS record.');
      loadSettings();
    } catch (error) {
      console.error('Failed to set custom domain:', error);
      alert('Failed to configure custom domain');
    }
  };

  const verifyDomain = async () => {
    if (!config) return;

    try {
      const response = await api.post(`/core/tenant-config/${config.id}/custom-domain/verify`);
      if (response.data.verified) {
        alert('Domain verified successfully!');
      } else {
        alert('Domain verification failed. Please check your DNS records.');
      }
      loadSettings();
    } catch (error) {
      console.error('Failed to verify domain:', error);
      alert('Failed to verify domain');
    }
  };

  const saveBranding = async () => {
    if (!config) return;

    try {
      await api.post(`/core/tenant-config/${config.id}/branding`, branding);
      alert('Branding updated successfully!');
    } catch (error) {
      console.error('Failed to update branding:', error);
      alert('Failed to update branding');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tenant Settings</h1>
        <p className="text-muted-foreground">Configure your organization's settings</p>
      </div>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Organization Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Organization Name</Label>
              <Input value={config?.name || ''} disabled />
            </div>
            <div>
              <Label>Default Domain</Label>
              <Input value={config?.domain || ''} disabled />
            </div>
          </div>
          <div>
            <Label>Status</Label>
            <div className="mt-2">
              <Badge variant={config?.isActive ? 'default' : 'secondary'}>
                {config?.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Custom Domain */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            <CardTitle>Custom Domain</CardTitle>
          </div>
          <CardDescription>
            Use your own domain for your Zerquiz instance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Custom Domain</Label>
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="e.g., exams.yourcompany.com"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
              />
              <Button onClick={setDomain}>Set Domain</Button>
            </div>
          </div>

          {config?.customDomain && (
            <div className="p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{config.customDomain}</span>
                {config.customDomainVerified ? (
                  <Badge variant="default" className="flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    Verified
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <X className="h-3 w-3" />
                    Not Verified
                  </Badge>
                )}
              </div>

              {!config.customDomainVerified && (
                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground">
                    Add the following DNS record to verify your domain:
                  </p>
                  <div className="p-3 bg-muted rounded font-mono text-xs">
                    Type: CNAME<br />
                    Name: {config.customDomain}<br />
                    Value: platform.zerquiz.com
                  </div>
                  <Button variant="outline" size="sm" onClick={verifyDomain}>
                    Verify Domain
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Branding */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            <CardTitle>Branding</CardTitle>
          </div>
          <CardDescription>
            Customize the look and feel of your platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Logo URL</Label>
              <Input
                placeholder="https://example.com/logo.png"
                value={branding.logo}
                onChange={(e) => setBranding({ ...branding, logo: e.target.value })}
              />
            </div>
            <div>
              <Label>Favicon URL</Label>
              <Input
                placeholder="https://example.com/favicon.ico"
                value={branding.favicon}
                onChange={(e) => setBranding({ ...branding, favicon: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Primary Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={branding.primaryColor}
                  onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                  className="w-20"
                />
                <Input
                  value={branding.primaryColor}
                  onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>Secondary Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={branding.secondaryColor}
                  onChange={(e) => setBranding({ ...branding, secondaryColor: e.target.value })}
                  className="w-20"
                />
                <Input
                  value={branding.secondaryColor}
                  onChange={(e) => setBranding({ ...branding, secondaryColor: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div>
            <Label>Custom CSS</Label>
            <Textarea
              placeholder="Enter custom CSS here..."
              value={branding.customCss}
              onChange={(e) => setBranding({ ...branding, customCss: e.target.value })}
              rows={6}
              className="font-mono text-sm"
            />
          </div>

          <Button onClick={saveBranding}>Save Branding</Button>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            className="p-6 rounded-lg border"
            style={{
              backgroundColor: branding.primaryColor + '10',
              borderColor: branding.primaryColor
            }}
          >
            <div className="flex items-center gap-4 mb-4">
              {branding.logo && (
                <img src={branding.logo} alt="Logo" className="h-12" />
              )}
              <h2 className="text-2xl font-bold" style={{ color: branding.primaryColor }}>
                {config?.name}
              </h2>
            </div>
            <Button style={{ backgroundColor: branding.primaryColor }}>
              Primary Button
            </Button>
            <Button 
              variant="outline" 
              className="ml-2"
              style={{ borderColor: branding.secondaryColor, color: branding.secondaryColor }}
            >
              Secondary Button
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

