/**
 * Location & Institution Management Page
 * Coğrafi ve Kurumsal Hiyerarşi Yönetim Sayfası
 */

import React, { useState, useMemo } from 'react';
import {
  Globe, Building2, MapPin, School, Users, Plus, Search, Filter,
  ChevronDown, ChevronRight, Edit, Trash2, Eye, Download, Upload,
  TrendingUp, BarChart3, Map, FileText, X,
} from 'lucide-react';
import {
  continents, countries, regions, cities, districts, institutionTypes, institutions, demoStudents,
  Continent, Country, Region, City, District, InstitutionType, Institution, Student,
  getCountriesByContinent, getRegionsByCountry, getCitiesByRegion, getDistrictsByCity,
  getInstitutionsByDistrict, getStudentsByInstitution, getLocationHierarchy,
  generateLocationReport, getLocationStatistics,
} from '../../mocks/locationHierarchyData';

type ViewMode = 'hierarchy' | 'institutions' | 'students' | 'reports';
type HierarchyLevel = 'continent' | 'country' | 'region' | 'city' | 'district';

export default function LocationManagementPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('hierarchy');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContinent, setSelectedContinent] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedInstitutionType, setSelectedInstitutionType] = useState<string | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [showAddModal, setShowAddModal] = useState(false);
  const [addModalType, setAddModalType] = useState<HierarchyLevel | 'institution' | null>(null);

  const stats = useMemo(() => getLocationStatistics(), []);

  const filteredInstitutions = useMemo(() => {
    let filtered = [...institutions];

    if (searchTerm) {
      filtered = filtered.filter(inst =>
        inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inst.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDistrict) {
      filtered = filtered.filter(i => i.districtId === selectedDistrict);
    } else if (selectedCity) {
      filtered = filtered.filter(i => i.cityId === selectedCity);
    } else if (selectedRegion) {
      filtered = filtered.filter(i => i.regionId === selectedRegion);
    } else if (selectedCountry) {
      filtered = filtered.filter(i => i.countryId === selectedCountry);
    }

    if (selectedInstitutionType) {
      filtered = filtered.filter(i => i.typeId === selectedInstitutionType);
    }

    return filtered;
  }, [searchTerm, selectedDistrict, selectedCity, selectedRegion, selectedCountry, selectedInstitutionType]);

  const filteredStudents = useMemo(() => {
    let filtered = [...demoStudents];

    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentNumber.includes(searchTerm)
      );
    }

    if (selectedDistrict) {
      filtered = filtered.filter(s => s.districtId === selectedDistrict);
    } else if (selectedCity) {
      filtered = filtered.filter(s => s.cityId === selectedCity);
    } else if (selectedRegion) {
      filtered = filtered.filter(s => s.regionId === selectedRegion);
    } else if (selectedCountry) {
      filtered = filtered.filter(s => s.countryId === selectedCountry);
    }

    return filtered;
  }, [searchTerm, selectedDistrict, selectedCity, selectedRegion, selectedCountry]);

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const handleAddNew = (type: HierarchyLevel | 'institution') => {
    setAddModalType(type);
    setShowAddModal(true);
  };

  const handleExportData = () => {
    const report = generateLocationReport({
      continentId: selectedContinent || undefined,
      countryId: selectedCountry || undefined,
      regionId: selectedRegion || undefined,
      cityId: selectedCity || undefined,
      districtId: selectedDistrict || undefined,
      institutionTypeId: selectedInstitutionType || undefined,
    });

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "location_report.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Lokasyon & Kurum Yönetimi
            </h1>
            <p className="text-gray-600 mt-2">Coğrafi hiyerarşi ve kurumsal yapı yönetimi</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleExportData}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
            >
              <Download className="w-4 h-4" />
              Rapor İndir
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
              <Upload className="w-4 h-4" />
              Toplu İçe Aktar
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          <StatCard icon={<Globe className="w-5 h-5" />} label="Kıta" value={stats.totalContinents} color="blue" />
          <StatCard icon={<MapPin className="w-5 h-5" />} label="Ülke" value={stats.totalCountries} color="green" />
          <StatCard icon={<Map className="w-5 h-5" />} label="Bölge" value={stats.totalRegions} color="purple" />
          <StatCard icon={<MapPin className="w-5 h-5" />} label="İl" value={stats.totalCities} color="orange" />
          <StatCard icon={<MapPin className="w-5 h-5" />} label="İlçe" value={stats.totalDistricts} color="pink" />
          <StatCard icon={<Building2 className="w-5 h-5" />} label="Kurum Tipi" value={stats.totalInstitutionTypes} color="indigo" />
          <StatCard icon={<School className="w-5 h-5" />} label="Kurum" value={stats.totalInstitutions} color="cyan" />
          <StatCard icon={<Users className="w-5 h-5" />} label="Öğrenci" value={stats.totalStudents} color="teal" />
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="bg-white rounded-xl shadow-sm p-2 mb-6 flex gap-2">
        <TabButton
          active={viewMode === 'hierarchy'}
          onClick={() => setViewMode('hierarchy')}
          icon={<Globe className="w-4 h-4" />}
          label="Coğrafi Hiyerarşi"
        />
        <TabButton
          active={viewMode === 'institutions'}
          onClick={() => setViewMode('institutions')}
          icon={<Building2 className="w-4 h-4" />}
          label="Kurumlar"
        />
        <TabButton
          active={viewMode === 'students'}
          onClick={() => setViewMode('students')}
          icon={<Users className="w-4 h-4" />}
          label="Öğrenciler"
        />
        <TabButton
          active={viewMode === 'reports'}
          onClick={() => setViewMode('reports')}
          icon={<BarChart3 className="w-4 h-4" />}
          label="Raporlar"
        />
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="md:col-span-3 lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <select
            value={selectedCountry || ''}
            onChange={(e) => {
              setSelectedCountry(e.target.value || null);
              setSelectedRegion(null);
              setSelectedCity(null);
              setSelectedDistrict(null);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tüm Ülkeler</option>
            {countries.map(country => (
              <option key={country.id} value={country.id}>{country.name}</option>
            ))}
          </select>

          <select
            value={selectedRegion || ''}
            onChange={(e) => {
              setSelectedRegion(e.target.value || null);
              setSelectedCity(null);
              setSelectedDistrict(null);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            disabled={!selectedCountry}
          >
            <option value="">Tüm Bölgeler</option>
            {selectedCountry && getRegionsByCountry(selectedCountry).map(region => (
              <option key={region.id} value={region.id}>{region.name}</option>
            ))}
          </select>

          <select
            value={selectedCity || ''}
            onChange={(e) => {
              setSelectedCity(e.target.value || null);
              setSelectedDistrict(null);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            disabled={!selectedRegion}
          >
            <option value="">Tüm İller</option>
            {selectedRegion && getCitiesByRegion(selectedRegion).map(city => (
              <option key={city.id} value={city.id}>{city.name}</option>
            ))}
          </select>

          <select
            value={selectedDistrict || ''}
            onChange={(e) => setSelectedDistrict(e.target.value || null)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            disabled={!selectedCity}
          >
            <option value="">Tüm İlçeler</option>
            {selectedCity && getDistrictsByCity(selectedCity).map(district => (
              <option key={district.id} value={district.id}>{district.name}</option>
            ))}
          </select>
        </div>

        {viewMode === 'institutions' && (
          <div className="mt-4">
            <select
              value={selectedInstitutionType || ''}
              onChange={(e) => setSelectedInstitutionType(e.target.value || null)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tüm Kurum Tipleri</option>
              {institutionTypes.map(type => (
                <option key={type.id} value={type.id}>{type.icon} {type.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        {viewMode === 'hierarchy' && (
          <HierarchyView
            expandedNodes={expandedNodes}
            toggleNode={toggleNode}
            onAddNew={handleAddNew}
          />
        )}

        {viewMode === 'institutions' && (
          <InstitutionsView
            institutions={filteredInstitutions}
            onAddNew={() => handleAddNew('institution')}
          />
        )}

        {viewMode === 'students' && (
          <StudentsView students={filteredStudents} />
        )}

        {viewMode === 'reports' && (
          <ReportsView
            selectedCountry={selectedCountry}
            selectedRegion={selectedRegion}
            selectedCity={selectedCity}
            selectedDistrict={selectedDistrict}
            selectedInstitutionType={selectedInstitutionType}
          />
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <AddModal
          type={addModalType}
          onClose={() => setShowAddModal(false)}
          onSave={() => {
            setShowAddModal(false);
            alert('Yeni kayıt eklendi! (Demo)');
          }}
        />
      )}
    </div>
  );
}

// ============================================
// SUB-COMPONENTS
// ============================================

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    pink: 'from-pink-500 to-pink-600',
    indigo: 'from-indigo-500 to-indigo-600',
    cyan: 'from-cyan-500 to-cyan-600',
    teal: 'from-teal-500 to-teal-600',
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
      <div className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} text-white mb-2`}>
        {icon}
      </div>
      <div className="text-2xl font-bold text-gray-800">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
        active
          ? 'bg-blue-600 text-white shadow-md'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function HierarchyView({
  expandedNodes,
  toggleNode,
  onAddNew,
}: {
  expandedNodes: Set<string>;
  toggleNode: (nodeId: string) => void;
  onAddNew: (type: HierarchyLevel) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Coğrafi Hiyerarşi Ağacı</h2>
        <button
          onClick={() => onAddNew('continent')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
        >
          <Plus className="w-4 h-4" />
          Yeni Kıta
        </button>
      </div>

      {continents.map(continent => (
        <div key={continent.id} className="border border-gray-200 rounded-lg">
          <div
            onClick={() => toggleNode(continent.id)}
            className="flex items-center gap-2 p-4 cursor-pointer hover:bg-gray-50 transition-colors"
          >
            {expandedNodes.has(continent.id) ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            <Globe className="w-5 h-5 text-blue-600" />
            <span className="font-semibold">{continent.name}</span>
            <span className="text-sm text-gray-500">({continent.code})</span>
          </div>

          {expandedNodes.has(continent.id) && (
            <div className="pl-8 pb-4 space-y-2">
              {getCountriesByContinent(continent.id).map(country => (
                <CountryNode key={country.id} country={country} expandedNodes={expandedNodes} toggleNode={toggleNode} />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function CountryNode({
  country,
  expandedNodes,
  toggleNode,
}: {
  country: Country;
  expandedNodes: Set<string>;
  toggleNode: (nodeId: string) => void;
}) {
  return (
    <div className="border border-gray-200 rounded-lg">
      <div
        onClick={() => toggleNode(country.id)}
        className="flex items-center gap-2 p-3 cursor-pointer hover:bg-gray-50 transition-colors"
      >
        {expandedNodes.has(country.id) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        <MapPin className="w-4 h-4 text-green-600" />
        <span className="font-medium">{country.name}</span>
        <span className="text-xs text-gray-500">{country.code}</span>
      </div>

      {expandedNodes.has(country.id) && (
        <div className="pl-6 pb-3 space-y-2">
          {getRegionsByCountry(country.id).map(region => (
            <RegionNode key={region.id} region={region} expandedNodes={expandedNodes} toggleNode={toggleNode} />
          ))}
        </div>
      )}
    </div>
  );
}

function RegionNode({
  region,
  expandedNodes,
  toggleNode,
}: {
  region: Region;
  expandedNodes: Set<string>;
  toggleNode: (nodeId: string) => void;
}) {
  return (
    <div className="border border-gray-200 rounded-lg">
      <div
        onClick={() => toggleNode(region.id)}
        className="flex items-center gap-2 p-3 cursor-pointer hover:bg-gray-50 transition-colors"
      >
        {expandedNodes.has(region.id) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        <Map className="w-4 h-4 text-purple-600" />
        <span className="font-medium text-sm">{region.name}</span>
      </div>

      {expandedNodes.has(region.id) && (
        <div className="pl-6 pb-3 space-y-2">
          {getCitiesByRegion(region.id).map(city => (
            <CityNode key={city.id} city={city} expandedNodes={expandedNodes} toggleNode={toggleNode} />
          ))}
        </div>
      )}
    </div>
  );
}

function CityNode({
  city,
  expandedNodes,
  toggleNode,
}: {
  city: City;
  expandedNodes: Set<string>;
  toggleNode: (nodeId: string) => void;
}) {
  return (
    <div className="border border-gray-200 rounded-lg">
      <div
        onClick={() => toggleNode(city.id)}
        className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-50 transition-colors"
      >
        {expandedNodes.has(city.id) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        <MapPin className="w-4 h-4 text-orange-600" />
        <span className="text-sm font-medium">{city.name}</span>
        {city.plateCode && <span className="text-xs text-gray-500">[{city.plateCode}]</span>}
      </div>

      {expandedNodes.has(city.id) && (
        <div className="pl-6 pb-2 space-y-1">
          {getDistrictsByCity(city.id).map(district => (
            <div key={district.id} className="flex items-center gap-2 p-2 text-sm text-gray-700">
              <MapPin className="w-3 h-3 text-pink-500" />
              {district.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function InstitutionsView({ institutions, onAddNew }: { institutions: Institution[]; onAddNew: () => void }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Kurumlar ({institutions.length})</h2>
        <button
          onClick={onAddNew}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
        >
          <Plus className="w-4 h-4" />
          Yeni Kurum
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {institutions.map(inst => (
          <InstitutionCard key={inst.id} institution={inst} />
        ))}
      </div>
    </div>
  );
}

function InstitutionCard({ institution }: { institution: Institution }) {
  const type = institutionTypes.find(t => t.id === institution.typeId);
  const studentCount = getStudentsByInstitution(institution.id).length;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{type?.icon}</span>
          <div>
            <h3 className="font-bold text-gray-800">{institution.name}</h3>
            <p className="text-xs text-gray-500">{institution.code}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          institution.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
        }`}>
          {institution.status === 'active' ? 'Aktif' : 'Pasif'}
        </span>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{institution.address}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Users className="w-4 h-4" />
          <span>{institution.currentStudentCount || studentCount} / {institution.studentCapacity} öğrenci</span>
        </div>
        {institution.phone && (
          <div className="text-gray-600">📞 {institution.phone}</div>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-all">
          <Eye className="w-4 h-4" />
          Detay
        </button>
        <button className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-all">
          <Edit className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function StudentsView({ students }: { students: Student[] }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Öğrenciler ({students.length})</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Öğrenci No</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Ad Soyad</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Kurum</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Sınıf</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">İl/İlçe</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Durum</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {students.map(student => {
              const city = cities.find(c => c.id === student.cityId);
              const district = districts.find(d => d.id === student.districtId);

              return (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{student.studentNumber}</td>
                  <td className="px-4 py-3 text-sm font-medium">{student.firstName} {student.lastName}</td>
                  <td className="px-4 py-3 text-sm">{student.institutionName}</td>
                  <td className="px-4 py-3 text-sm">{student.grade}-{student.class}</td>
                  <td className="px-4 py-3 text-sm">{city?.name} / {district?.name}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      student.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {student.status === 'active' ? 'Aktif' : student.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-blue-600 hover:text-blue-800">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReportsView({
  selectedCountry,
  selectedRegion,
  selectedCity,
  selectedDistrict,
  selectedInstitutionType,
}: {
  selectedCountry: string | null;
  selectedRegion: string | null;
  selectedCity: string | null;
  selectedDistrict: string | null;
  selectedInstitutionType: string | null;
}) {
  const report = useMemo(() => generateLocationReport({
    countryId: selectedCountry || undefined,
    regionId: selectedRegion || undefined,
    cityId: selectedCity || undefined,
    districtId: selectedDistrict || undefined,
    institutionTypeId: selectedInstitutionType || undefined,
  }), [selectedCountry, selectedRegion, selectedCity, selectedDistrict, selectedInstitutionType]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Lokasyon Bazlı Raporlar</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6">
          <div className="text-3xl font-bold">{report.totalInstitutions}</div>
          <div className="text-blue-100">Toplam Kurum</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6">
          <div className="text-3xl font-bold">{report.activeInstitutions}</div>
          <div className="text-green-100">Aktif Kurum</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6">
          <div className="text-3xl font-bold">{report.totalStudents}</div>
          <div className="text-purple-100">Toplam Öğrenci</div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg p-6">
          <div className="text-3xl font-bold">{report.activeStudents}</div>
          <div className="text-orange-100">Aktif Öğrenci</div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Kurum Tiplerine Göre Dağılım</h3>
        <div className="space-y-3">
          {report.institutionsByType.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-gray-700">{item.type}</span>
              <div className="flex items-center gap-3">
                <div className="w-64 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                    style={{ width: `${(item.count / report.totalInstitutions) * 100}%` }}
                  />
                </div>
                <span className="font-bold text-gray-800 w-12 text-right">{item.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AddModal({
  type,
  onClose,
  onSave,
}: {
  type: HierarchyLevel | 'institution' | null;
  onClose: () => void;
  onSave: () => void;
}) {
  if (!type) return null;

  const titles = {
    continent: 'Yeni Kıta Ekle',
    country: 'Yeni Ülke Ekle',
    region: 'Yeni Bölge Ekle',
    city: 'Yeni İl Ekle',
    district: 'Yeni İlçe Ekle',
    institution: 'Yeni Kurum Ekle',
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">{titles[type]}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kod</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Kod giriniz"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ad (Türkçe)</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Türkçe ad giriniz"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ad (İngilizce)</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="İngilizce ad giriniz"
            />
          </div>

          {type === 'institution' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kurum Tipi</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="">Seçiniz</option>
                  {institutionTypes.map(t => (
                    <option key={t.id} value={t.id}>{t.icon} {t.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Adres</label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Adres giriniz"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="+90"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="email@example.com"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-all"
          >
            İptal
          </button>
          <button
            onClick={onSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
          >
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}

