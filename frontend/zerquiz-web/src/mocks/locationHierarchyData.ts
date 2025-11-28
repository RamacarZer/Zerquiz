/**
 * Geographic and Institutional Hierarchy System
 * Coğrafi ve Kurumsal Hiyerarşi Sistemi
 * Kıta → Ülke → Eyalet/Bölge → İl → İlçe → Kurum
 */

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface Continent {
  id: string;
  code: string;
  name: string;
  nameEn: string;
  isActive: boolean;
}

export interface Country {
  id: string;
  continentId: string;
  code: string; // ISO 3166-1 alpha-2
  code3: string; // ISO 3166-1 alpha-3
  name: string;
  nameEn: string;
  phoneCode: string;
  currency: string;
  language: string;
  timezone: string;
  isActive: boolean;
}

export interface Region {
  id: string;
  countryId: string;
  code: string;
  name: string;
  nameEn: string;
  type: 'state' | 'province' | 'region' | 'canton' | 'oblast';
  isActive: boolean;
}

export interface City {
  id: string;
  regionId: string;
  countryId: string;
  code: string;
  name: string;
  nameEn: string;
  plateCode?: string; // Türkiye için plaka kodu
  population?: number;
  latitude?: number;
  longitude?: number;
  isActive: boolean;
}

export interface District {
  id: string;
  cityId: string;
  regionId: string;
  countryId: string;
  code: string;
  name: string;
  nameEn: string;
  population?: number;
  postalCode?: string;
  isActive: boolean;
}

export interface InstitutionType {
  id: string;
  code: string;
  name: string;
  nameEn: string;
  category: 'education' | 'corporate' | 'government' | 'ngo' | 'healthcare' | 'other';
  level?: 'primary' | 'secondary' | 'high' | 'university' | 'vocational' | 'special';
  description: string;
  icon: string;
  color: string;
  isActive: boolean;
}

export interface Institution {
  id: string;
  typeId: string;
  typeName: string;
  code: string;
  name: string;
  shortName?: string;
  districtId: string;
  cityId: string;
  regionId: string;
  countryId: string;
  address: string;
  postalCode?: string;
  phone?: string;
  email?: string;
  website?: string;
  principalName?: string;
  studentCapacity?: number;
  currentStudentCount?: number;
  teacherCount?: number;
  foundedYear?: number;
  accreditation?: string[];
  features: string[];
  status: 'active' | 'inactive' | 'pending' | 'closed';
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  nationalId?: string;
  studentNumber: string;
  institutionId: string;
  institutionName: string;
  districtId: string;
  cityId: string;
  regionId: string;
  countryId: string;
  grade?: string;
  class?: string;
  section?: string;
  enrollmentDate: string;
  status: 'active' | 'inactive' | 'graduated' | 'transferred';
  guardianName?: string;
  guardianPhone?: string;
  guardianEmail?: string;
  address?: string;
}

export interface LocationHierarchy {
  continent: Continent;
  country: Country;
  region?: Region;
  city: City;
  district: District;
}

// ============================================
// DEMO DATA - CONTINENTS
// ============================================

export const continents: Continent[] = [
  { id: 'cont-001', code: 'EU', name: 'Avrupa', nameEn: 'Europe', isActive: true },
  { id: 'cont-002', code: 'AS', name: 'Asya', nameEn: 'Asia', isActive: true },
  { id: 'cont-003', code: 'AF', name: 'Afrika', nameEn: 'Africa', isActive: true },
  { id: 'cont-004', code: 'NA', name: 'Kuzey Amerika', nameEn: 'North America', isActive: true },
  { id: 'cont-005', code: 'SA', name: 'Güney Amerika', nameEn: 'South America', isActive: true },
  { id: 'cont-006', code: 'OC', name: 'Okyanusya', nameEn: 'Oceania', isActive: true },
];

// ============================================
// DEMO DATA - COUNTRIES
// ============================================

export const countries: Country[] = [
  {
    id: 'country-001',
    continentId: 'cont-002',
    code: 'TR',
    code3: 'TUR',
    name: 'Türkiye',
    nameEn: 'Turkey',
    phoneCode: '+90',
    currency: 'TRY',
    language: 'tr',
    timezone: 'Europe/Istanbul',
    isActive: true,
  },
  {
    id: 'country-002',
    continentId: 'cont-004',
    code: 'US',
    code3: 'USA',
    name: 'Amerika Birleşik Devletleri',
    nameEn: 'United States',
    phoneCode: '+1',
    currency: 'USD',
    language: 'en',
    timezone: 'America/New_York',
    isActive: true,
  },
  {
    id: 'country-003',
    continentId: 'cont-001',
    code: 'DE',
    code3: 'DEU',
    name: 'Almanya',
    nameEn: 'Germany',
    phoneCode: '+49',
    currency: 'EUR',
    language: 'de',
    timezone: 'Europe/Berlin',
    isActive: true,
  },
  {
    id: 'country-004',
    continentId: 'cont-001',
    code: 'GB',
    code3: 'GBR',
    name: 'Birleşik Krallık',
    nameEn: 'United Kingdom',
    phoneCode: '+44',
    currency: 'GBP',
    language: 'en',
    timezone: 'Europe/London',
    isActive: true,
  },
];

// ============================================
// DEMO DATA - REGIONS (TÜRKİYE)
// ============================================

export const regions: Region[] = [
  {
    id: 'region-001',
    countryId: 'country-001',
    code: 'TR-MAR',
    name: 'Marmara Bölgesi',
    nameEn: 'Marmara Region',
    type: 'region',
    isActive: true,
  },
  {
    id: 'region-002',
    countryId: 'country-001',
    code: 'TR-EGE',
    name: 'Ege Bölgesi',
    nameEn: 'Aegean Region',
    type: 'region',
    isActive: true,
  },
  {
    id: 'region-003',
    countryId: 'country-001',
    code: 'TR-AKD',
    name: 'Akdeniz Bölgesi',
    nameEn: 'Mediterranean Region',
    type: 'region',
    isActive: true,
  },
  {
    id: 'region-004',
    countryId: 'country-001',
    code: 'TR-ICA',
    name: 'İç Anadolu Bölgesi',
    nameEn: 'Central Anatolia Region',
    type: 'region',
    isActive: true,
  },
  {
    id: 'region-005',
    countryId: 'country-001',
    code: 'TR-KAR',
    name: 'Karadeniz Bölgesi',
    nameEn: 'Black Sea Region',
    type: 'region',
    isActive: true,
  },
  {
    id: 'region-006',
    countryId: 'country-001',
    code: 'TR-DAD',
    name: 'Doğu Anadolu Bölgesi',
    nameEn: 'Eastern Anatolia Region',
    type: 'region',
    isActive: true,
  },
  {
    id: 'region-007',
    countryId: 'country-001',
    code: 'TR-GAD',
    name: 'Güneydoğu Anadolu Bölgesi',
    nameEn: 'Southeastern Anatolia Region',
    type: 'region',
    isActive: true,
  },
];

// ============================================
// DEMO DATA - CITIES (İLLER)
// ============================================

export const cities: City[] = [
  {
    id: 'city-001',
    regionId: 'region-001',
    countryId: 'country-001',
    code: 'TR-34',
    name: 'İstanbul',
    nameEn: 'Istanbul',
    plateCode: '34',
    population: 15840900,
    latitude: 41.0082,
    longitude: 28.9784,
    isActive: true,
  },
  {
    id: 'city-002',
    regionId: 'region-004',
    countryId: 'country-001',
    code: 'TR-06',
    name: 'Ankara',
    nameEn: 'Ankara',
    plateCode: '06',
    population: 5663322,
    latitude: 39.9334,
    longitude: 32.8597,
    isActive: true,
  },
  {
    id: 'city-003',
    regionId: 'region-002',
    countryId: 'country-001',
    code: 'TR-35',
    name: 'İzmir',
    nameEn: 'Izmir',
    plateCode: '35',
    population: 4425789,
    latitude: 38.4192,
    longitude: 27.1287,
    isActive: true,
  },
  {
    id: 'city-004',
    regionId: 'region-001',
    countryId: 'country-001',
    code: 'TR-16',
    name: 'Bursa',
    nameEn: 'Bursa',
    plateCode: '16',
    population: 3147818,
    latitude: 40.1826,
    longitude: 29.0665,
    isActive: true,
  },
  {
    id: 'city-005',
    regionId: 'region-003',
    countryId: 'country-001',
    code: 'TR-07',
    name: 'Antalya',
    nameEn: 'Antalya',
    plateCode: '07',
    population: 2619832,
    latitude: 36.8969,
    longitude: 30.7133,
    isActive: true,
  },
];

// ============================================
// DEMO DATA - DISTRICTS (İLÇELER)
// ============================================

export const districts: District[] = [
  // İSTANBUL İLÇELERİ
  {
    id: 'district-001',
    cityId: 'city-001',
    regionId: 'region-001',
    countryId: 'country-001',
    code: 'TR-34-KAD',
    name: 'Kadıköy',
    nameEn: 'Kadikoy',
    population: 467919,
    postalCode: '34000',
    isActive: true,
  },
  {
    id: 'district-002',
    cityId: 'city-001',
    regionId: 'region-001',
    countryId: 'country-001',
    code: 'TR-34-BES',
    name: 'Beşiktaş',
    nameEn: 'Besiktas',
    population: 190033,
    postalCode: '34300',
    isActive: true,
  },
  {
    id: 'district-003',
    cityId: 'city-001',
    regionId: 'region-001',
    countryId: 'country-001',
    code: 'TR-34-USK',
    name: 'Üsküdar',
    nameEn: 'Uskudar',
    population: 531771,
    postalCode: '34660',
    isActive: true,
  },
  {
    id: 'district-004',
    cityId: 'city-001',
    regionId: 'region-001',
    countryId: 'country-001',
    code: 'TR-34-SIS',
    name: 'Şişli',
    nameEn: 'Sisli',
    population: 275000,
    postalCode: '34360',
    isActive: true,
  },
  // ANKARA İLÇELERİ
  {
    id: 'district-005',
    cityId: 'city-002',
    regionId: 'region-004',
    countryId: 'country-001',
    code: 'TR-06-CAN',
    name: 'Çankaya',
    nameEn: 'Cankaya',
    population: 933680,
    postalCode: '06000',
    isActive: true,
  },
  {
    id: 'district-006',
    cityId: 'city-002',
    regionId: 'region-004',
    countryId: 'country-001',
    code: 'TR-06-YEN',
    name: 'Yenimahalle',
    nameEn: 'Yenimahalle',
    population: 700000,
    postalCode: '06170',
    isActive: true,
  },
  // İZMİR İLÇELERİ
  {
    id: 'district-007',
    cityId: 'city-003',
    regionId: 'region-002',
    countryId: 'country-001',
    code: 'TR-35-KAR',
    name: 'Karşıyaka',
    nameEn: 'Karsiyaka',
    population: 350000,
    postalCode: '35500',
    isActive: true,
  },
  {
    id: 'district-008',
    cityId: 'city-003',
    regionId: 'region-002',
    countryId: 'country-001',
    code: 'TR-35-BOR',
    name: 'Bornova',
    nameEn: 'Bornova',
    population: 450000,
    postalCode: '35040',
    isActive: true,
  },
];

// ============================================
// DEMO DATA - INSTITUTION TYPES
// ============================================

export const institutionTypes: InstitutionType[] = [
  {
    id: 'type-001',
    code: 'PRIMARY_SCHOOL',
    name: 'İlkokul',
    nameEn: 'Primary School',
    category: 'education',
    level: 'primary',
    description: '1-4. Sınıf eğitim veren okul',
    icon: '🏫',
    color: '#3B82F6',
    isActive: true,
  },
  {
    id: 'type-002',
    code: 'MIDDLE_SCHOOL',
    name: 'Ortaokul',
    nameEn: 'Middle School',
    category: 'education',
    level: 'secondary',
    description: '5-8. Sınıf eğitim veren okul',
    icon: '🏫',
    color: '#10B981',
    isActive: true,
  },
  {
    id: 'type-003',
    code: 'HIGH_SCHOOL',
    name: 'Lise',
    nameEn: 'High School',
    category: 'education',
    level: 'high',
    description: '9-12. Sınıf eğitim veren okul',
    icon: '🏫',
    color: '#8B5CF6',
    isActive: true,
  },
  {
    id: 'type-004',
    code: 'UNIVERSITY',
    name: 'Üniversite',
    nameEn: 'University',
    category: 'education',
    level: 'university',
    description: 'Yükseköğretim kurumu',
    icon: '🎓',
    color: '#F59E0B',
    isActive: true,
  },
  {
    id: 'type-005',
    code: 'VOCATIONAL_SCHOOL',
    name: 'Meslek Lisesi',
    nameEn: 'Vocational School',
    category: 'education',
    level: 'vocational',
    description: 'Mesleki ve teknik eğitim veren lise',
    icon: '🔧',
    color: '#EF4444',
    isActive: true,
  },
  {
    id: 'type-006',
    code: 'PRIVATE_SCHOOL',
    name: 'Özel Okul',
    nameEn: 'Private School',
    category: 'education',
    level: 'primary',
    description: 'Özel eğitim kurumu',
    icon: '⭐',
    color: '#EC4899',
    isActive: true,
  },
  {
    id: 'type-007',
    code: 'TRAINING_CENTER',
    name: 'Eğitim Merkezi',
    nameEn: 'Training Center',
    category: 'education',
    description: 'Özel kurs ve eğitim merkezi',
    icon: '📚',
    color: '#06B6D4',
    isActive: true,
  },
  {
    id: 'type-008',
    code: 'CORPORATE',
    name: 'Kurumsal Firma',
    nameEn: 'Corporate Company',
    category: 'corporate',
    description: 'Kurumsal eğitim alan şirket',
    icon: '🏢',
    color: '#64748B',
    isActive: true,
  },
];

// ============================================
// DEMO DATA - INSTITUTIONS
// ============================================

export const institutions: Institution[] = [
  {
    id: 'inst-001',
    typeId: 'type-003',
    typeName: 'Lise',
    code: 'IST-KAD-001',
    name: 'Kadıköy Anadolu Lisesi',
    shortName: 'KAL',
    districtId: 'district-001',
    cityId: 'city-001',
    regionId: 'region-001',
    countryId: 'country-001',
    address: 'Caferağa Mahallesi, Moda Caddesi No: 123',
    postalCode: '34710',
    phone: '+90 216 345 67 89',
    email: 'info@kadikoylistesi.edu.tr',
    website: 'www.kadikoyalesi.meb.k12.tr',
    principalName: 'Mehmet Yılmaz',
    studentCapacity: 800,
    currentStudentCount: 720,
    teacherCount: 45,
    foundedYear: 1985,
    accreditation: ['MEB', 'IB'],
    features: ['Akıllı Tahta', 'Bilgisayar Laboratuvarı', 'Spor Salonu', 'Kütüphane'],
    status: 'active',
    latitude: 40.9872,
    longitude: 29.0255,
    createdAt: '2020-01-15T10:00:00Z',
    updatedAt: '2024-11-28T15:30:00Z',
  },
  {
    id: 'inst-002',
    typeId: 'type-002',
    typeName: 'Ortaokul',
    code: 'IST-BES-001',
    name: 'Beşiktaş Ortaokulu',
    shortName: 'BO',
    districtId: 'district-002',
    cityId: 'city-001',
    regionId: 'region-001',
    countryId: 'country-001',
    address: 'Şişli Mahallesi, Barbaros Bulvarı No: 45',
    postalCode: '34353',
    phone: '+90 212 234 56 78',
    email: 'info@besiktasortaokul.edu.tr',
    principalName: 'Ayşe Demir',
    studentCapacity: 500,
    currentStudentCount: 480,
    teacherCount: 30,
    foundedYear: 1995,
    features: ['Bilim Laboratuvarı', 'Müzik Odası', 'Sanat Atölyesi'],
    status: 'active',
    createdAt: '2020-03-20T09:00:00Z',
    updatedAt: '2024-11-25T12:00:00Z',
  },
  {
    id: 'inst-003',
    typeId: 'type-004',
    typeName: 'Üniversite',
    code: 'ANK-CAN-001',
    name: 'Çankaya Üniversitesi',
    shortName: 'ÇÜ',
    districtId: 'district-005',
    cityId: 'city-002',
    regionId: 'region-004',
    countryId: 'country-001',
    address: 'Öğretmenler Caddesi No: 14',
    postalCode: '06530',
    phone: '+90 312 284 45 00',
    email: 'info@cankaya.edu.tr',
    website: 'www.cankaya.edu.tr',
    principalName: 'Prof. Dr. Can Çağlar',
    studentCapacity: 15000,
    currentStudentCount: 12500,
    teacherCount: 650,
    foundedYear: 1997,
    accreditation: ['YÖK', 'ABET', 'MÜDEK'],
    features: ['Araştırma Merkezi', 'Yurt', 'Kampüs', 'Teknoloji Transfer Ofisi'],
    status: 'active',
    latitude: 39.9015,
    longitude: 32.8634,
    createdAt: '2019-09-01T08:00:00Z',
    updatedAt: '2024-11-20T14:00:00Z',
  },
  {
    id: 'inst-004',
    typeId: 'type-007',
    typeName: 'Eğitim Merkezi',
    code: 'IZM-KAR-001',
    name: 'Karşıyaka Dershane ve Etüt Merkezi',
    shortName: 'KDEM',
    districtId: 'district-007',
    cityId: 'city-003',
    regionId: 'region-002',
    countryId: 'country-001',
    address: 'Atatürk Bulvarı No: 234',
    postalCode: '35530',
    phone: '+90 232 369 12 34',
    email: 'info@karsiyakadershane.com',
    website: 'www.karsiyakadershane.com',
    principalName: 'Zeynep Kaya',
    studentCapacity: 300,
    currentStudentCount: 250,
    teacherCount: 18,
    foundedYear: 2015,
    features: ['Online Eğitim', 'Deneme Sınavları', 'Bireysel Takip'],
    status: 'active',
    createdAt: '2021-06-15T10:00:00Z',
    updatedAt: '2024-11-28T09:00:00Z',
  },
];

// ============================================
// DEMO DATA - STUDENTS
// ============================================

export const demoStudents: Student[] = [
  {
    id: 'student-001',
    firstName: 'Ali',
    lastName: 'Yılmaz',
    email: 'ali.yilmaz@student.edu.tr',
    phone: '+90 532 123 45 67',
    nationalId: '12345678901',
    studentNumber: '2023001',
    institutionId: 'inst-001',
    institutionName: 'Kadıköy Anadolu Lisesi',
    districtId: 'district-001',
    cityId: 'city-001',
    regionId: 'region-001',
    countryId: 'country-001',
    grade: '11',
    class: 'A',
    section: '1',
    enrollmentDate: '2023-09-01',
    status: 'active',
    guardianName: 'Mehmet Yılmaz',
    guardianPhone: '+90 532 999 88 77',
    guardianEmail: 'mehmet.yilmaz@email.com',
    address: 'Kadıköy, İstanbul',
  },
  {
    id: 'student-002',
    firstName: 'Zeynep',
    lastName: 'Kaya',
    email: 'zeynep.kaya@student.edu.tr',
    phone: '+90 543 234 56 78',
    nationalId: '98765432109',
    studentNumber: '2023002',
    institutionId: 'inst-002',
    institutionName: 'Beşiktaş Ortaokulu',
    districtId: 'district-002',
    cityId: 'city-001',
    regionId: 'region-001',
    countryId: 'country-001',
    grade: '7',
    class: 'B',
    section: '2',
    enrollmentDate: '2023-09-01',
    status: 'active',
    guardianName: 'Ayşe Kaya',
    guardianPhone: '+90 543 111 22 33',
    guardianEmail: 'ayse.kaya@email.com',
    address: 'Beşiktaş, İstanbul',
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getCountriesByContinent(continentId: string): Country[] {
  return countries.filter(c => c.continentId === continentId);
}

export function getRegionsByCountry(countryId: string): Region[] {
  return regions.filter(r => r.countryId === countryId);
}

export function getCitiesByRegion(regionId: string): City[] {
  return cities.filter(c => c.regionId === regionId);
}

export function getCitiesByCountry(countryId: string): City[] {
  return cities.filter(c => c.countryId === countryId);
}

export function getDistrictsByCity(cityId: string): District[] {
  return districts.filter(d => d.cityId === cityId);
}

export function getInstitutionsByDistrict(districtId: string): Institution[] {
  return institutions.filter(i => i.districtId === districtId);
}

export function getInstitutionsByCity(cityId: string): Institution[] {
  return institutions.filter(i => i.cityId === cityId);
}

export function getInstitutionsByType(typeId: string): Institution[] {
  return institutions.filter(i => i.typeId === typeId);
}

export function getStudentsByInstitution(institutionId: string): Student[] {
  return demoStudents.filter(s => s.institutionId === institutionId);
}

export function getStudentsByCity(cityId: string): Student[] {
  return demoStudents.filter(s => s.cityId === cityId);
}

export function getStudentsByDistrict(districtId: string): Student[] {
  return demoStudents.filter(s => s.districtId === districtId);
}

export function getLocationHierarchy(districtId: string): LocationHierarchy | null {
  const district = districts.find(d => d.id === districtId);
  if (!district) return null;

  const city = cities.find(c => c.id === district.cityId);
  if (!city) return null;

  const region = regions.find(r => r.id === city.regionId);
  const country = countries.find(c => c.id === city.countryId);
  if (!country) return null;

  const continent = continents.find(c => c.id === country.continentId);
  if (!continent) return null;

  return { continent, country, region, city, district };
}

export function getFullAddress(student: Student): string {
  const hierarchy = getLocationHierarchy(student.districtId);
  if (!hierarchy) return student.address || '';

  return `${hierarchy.district.name}, ${hierarchy.city.name}, ${hierarchy.country.name}`;
}

export function generateLocationReport(filter: {
  continentId?: string;
  countryId?: string;
  regionId?: string;
  cityId?: string;
  districtId?: string;
  institutionTypeId?: string;
}) {
  let filteredInstitutions = [...institutions];
  let filteredStudents = [...demoStudents];

  if (filter.districtId) {
    filteredInstitutions = filteredInstitutions.filter(i => i.districtId === filter.districtId);
    filteredStudents = filteredStudents.filter(s => s.districtId === filter.districtId);
  } else if (filter.cityId) {
    filteredInstitutions = filteredInstitutions.filter(i => i.cityId === filter.cityId);
    filteredStudents = filteredStudents.filter(s => s.cityId === filter.cityId);
  } else if (filter.regionId) {
    filteredInstitutions = filteredInstitutions.filter(i => i.regionId === filter.regionId);
    filteredStudents = filteredStudents.filter(s => s.regionId === filter.regionId);
  } else if (filter.countryId) {
    filteredInstitutions = filteredInstitutions.filter(i => i.countryId === filter.countryId);
    filteredStudents = filteredStudents.filter(s => s.countryId === filter.countryId);
  }

  if (filter.institutionTypeId) {
    filteredInstitutions = filteredInstitutions.filter(i => i.typeId === filter.institutionTypeId);
  }

  return {
    totalInstitutions: filteredInstitutions.length,
    activeInstitutions: filteredInstitutions.filter(i => i.status === 'active').length,
    totalStudents: filteredStudents.length,
    activeStudents: filteredStudents.filter(s => s.status === 'active').length,
    institutionsByType: institutionTypes.map(type => ({
      type: type.name,
      count: filteredInstitutions.filter(i => i.typeId === type.id).length,
    })),
    institutions: filteredInstitutions,
    students: filteredStudents,
  };
}

export function getLocationStatistics() {
  return {
    totalContinents: continents.filter(c => c.isActive).length,
    totalCountries: countries.filter(c => c.isActive).length,
    totalRegions: regions.filter(r => r.isActive).length,
    totalCities: cities.filter(c => c.isActive).length,
    totalDistricts: districts.filter(d => d.isActive).length,
    totalInstitutionTypes: institutionTypes.filter(t => t.isActive).length,
    totalInstitutions: institutions.filter(i => i.status === 'active').length,
    totalStudents: demoStudents.filter(s => s.status === 'active').length,
  };
}

