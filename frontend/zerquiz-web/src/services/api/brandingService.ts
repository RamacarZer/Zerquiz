import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

// ==================== TYPES ====================

export interface BrandingSettingsDto {
  id?: string;
  tenantId: string;
  
  // General
  displayName: string;
  subdomain?: string;
  customDomain?: string;
  domainVerified?: boolean;
  
  // Logo & Images
  logoUrl?: string;
  logoLightUrl?: string;
  logoDarkUrl?: string;
  faviconUrl?: string;
  loginBackgroundUrl?: string;
  dashboardBannerUrl?: string;
  
  // SEO
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  
  // Email Branding
  emailSenderName?: string;
  emailSenderAddress?: string;
  emailLogoUrl?: string;
  emailFooterText?: string;
  
  // Social Media
  facebookUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  
  // Contact
  supportEmail?: string;
  supportPhone?: string;
  address?: string;
  
  // Color Theme (JSON)
  colorThemeJson?: string;
  
  // Advanced (JSON)
  advancedSettingsJson?: string;
  
  // Localization
  defaultLanguage?: string;
  defaultTimezone?: string;
  defaultCurrency?: string;
  dateFormat?: string;
  timeFormat?: string;
  
  // Feature Flags (JSON)
  featureFlagsJson?: string;
}

export interface ColorTheme {
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
}

export interface AdvancedSettings {
  customCss?: string;
  customJs?: string;
  customHtmlHead?: string;
  googleAnalyticsId?: string;
  facebookPixelId?: string;
  googleTagManagerId?: string;
}

export interface FeatureFlags {
  enableCustomDomain: boolean;
  enableWhiteLabel: boolean;
  enableCustomCss: boolean;
  enableCustomJs: boolean;
  enableSso: boolean;
  enableApi: boolean;
  enableWebhooks: boolean;
  [key: string]: boolean;
}

export interface UpdateGeneralSettingsRequest {
  displayName: string;
  subdomain?: string;
  customDomain?: string;
  logoUrl?: string;
  logoLightUrl?: string;
  logoDarkUrl?: string;
  faviconUrl?: string;
  loginBackgroundUrl?: string;
  dashboardBannerUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
}

export interface UpdateColorThemeRequest {
  colorThemeJson?: string;
}

export interface UpdateEmailBrandingRequest {
  emailSenderName?: string;
  emailSenderAddress?: string;
  emailLogoUrl?: string;
  emailFooterText?: string;
}

export interface UpdateSocialMediaRequest {
  facebookUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
}

export interface UpdateContactInfoRequest {
  supportEmail?: string;
  supportPhone?: string;
  address?: string;
}

export interface UpdateAdvancedSettingsRequest {
  advancedSettingsJson?: string;
  defaultLanguage?: string;
  defaultTimezone?: string;
  defaultCurrency?: string;
  dateFormat?: string;
  timeFormat?: string;
}

export interface UpdateFeatureFlagsRequest {
  featureFlagsJson?: string;
}

// ==================== API FUNCTIONS ====================

export const getBrandingSettings = async (tenantId: string): Promise<BrandingSettingsDto> => {
  const response = await axios.get(`${API_BASE_URL}/tenants/${tenantId}/branding`);
  return response.data.data;
};

export const updateGeneralSettings = async (
  tenantId: string,
  request: UpdateGeneralSettingsRequest
): Promise<void> => {
  await axios.put(`${API_BASE_URL}/tenants/${tenantId}/branding/general`, request);
};

export const updateColorTheme = async (
  tenantId: string,
  request: UpdateColorThemeRequest
): Promise<void> => {
  await axios.put(`${API_BASE_URL}/tenants/${tenantId}/branding/colors`, request);
};

export const updateEmailBranding = async (
  tenantId: string,
  request: UpdateEmailBrandingRequest
): Promise<void> => {
  await axios.put(`${API_BASE_URL}/tenants/${tenantId}/branding/email`, request);
};

export const updateSocialMedia = async (
  tenantId: string,
  request: UpdateSocialMediaRequest
): Promise<void> => {
  await axios.put(`${API_BASE_URL}/tenants/${tenantId}/branding/social`, request);
};

export const updateContactInfo = async (
  tenantId: string,
  request: UpdateContactInfoRequest
): Promise<void> => {
  await axios.put(`${API_BASE_URL}/tenants/${tenantId}/branding/contact`, request);
};

export const updateAdvancedSettings = async (
  tenantId: string,
  request: UpdateAdvancedSettingsRequest
): Promise<void> => {
  await axios.put(`${API_BASE_URL}/tenants/${tenantId}/branding/advanced`, request);
};

export const updateFeatureFlags = async (
  tenantId: string,
  request: UpdateFeatureFlagsRequest
): Promise<void> => {
  await axios.put(`${API_BASE_URL}/tenants/${tenantId}/branding/features`, request);
};

export const verifyDomain = async (tenantId: string): Promise<{ domain: string; verified: boolean }> => {
  const response = await axios.post(`${API_BASE_URL}/tenants/${tenantId}/branding/verify-domain`);
  return response.data.data;
};

// Helper functions
export const parseColorTheme = (json?: string): ColorTheme | null => {
  if (!json) return null;
  try {
    return JSON.parse(json) as ColorTheme;
  } catch {
    return null;
  }
};

export const parseAdvancedSettings = (json?: string): AdvancedSettings | null => {
  if (!json) return null;
  try {
    return JSON.parse(json) as AdvancedSettings;
  } catch {
    return null;
  }
};

export const parseFeatureFlags = (json?: string): FeatureFlags | null => {
  if (!json) return null;
  try {
    return JSON.parse(json) as FeatureFlags;
  } catch {
    return null;
  }
};

