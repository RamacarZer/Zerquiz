/**
 * Dynamic Fields Management Page
 * Dinamik Alan ve Grup Yönetim Sayfası
 */

import React, { useState, useMemo } from 'react';
import {
  Settings, Plus, Search, Edit, Trash2, Eye, Copy, Download, Upload,
  ChevronDown, ChevronRight, Grid, List, Save, X, Check, AlertCircle,
  Type, Hash, Calendar, Mail, Phone, Link, Image as ImageIcon, Star,
  CheckSquare, Square, Circle, Sliders, MapPin, Code,
} from 'lucide-react';
import {
  demoFieldGroups, demoDynamicFields, fieldTemplates, demoFieldValues,
  FieldGroup, DynamicField, FieldType, EntityType, FieldOption, ValidationRule,
  getFieldsByGroup, getGroupsByEntity, getFieldsByEntity, getFieldValue,
  setFieldValue, validateField, getFieldStatistics,
} from '../../mocks/dynamicFieldsData';

type ViewMode = 'groups' | 'fields' | 'templates' | 'preview';

const ENTITY_TYPE_LABELS: Record<EntityType, string> = {
  student: 'Öğrenci',
  teacher: 'Öğretmen',
  institution: 'Kurum',
  exam: 'Sınav',
  question: 'Soru',
  course: 'Ders',
  user: 'Kullanıcı',
  contract: 'Sözleşme',
  invoice: 'Fatura',
  payment: 'Ödeme',
};

const FIELD_TYPE_ICONS: Record<FieldType, React.ReactNode> = {
  text: <Type className="w-4 h-4" />,
  number: <Hash className="w-4 h-4" />,
  email: <Mail className="w-4 h-4" />,
  phone: <Phone className="w-4 h-4" />,
  date: <Calendar className="w-4 h-4" />,
  datetime: <Calendar className="w-4 h-4" />,
  select: <ChevronDown className="w-4 h-4" />,
  multiselect: <CheckSquare className="w-4 h-4" />,
  radio: <Circle className="w-4 h-4" />,
  checkbox: <CheckSquare className="w-4 h-4" />,
  textarea: <Type className="w-4 h-4" />,
  file: <Upload className="w-4 h-4" />,
  image: <ImageIcon className="w-4 h-4" />,
  url: <Link className="w-4 h-4" />,
  color: <Square className="w-4 h-4" />,
  rating: <Star className="w-4 h-4" />,
  slider: <Sliders className="w-4 h-4" />,
  location: <MapPin className="w-4 h-4" />,
  json: <Code className="w-4 h-4" />,
};

export default function DynamicFieldsManagementPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('groups');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntityType, setSelectedEntityType] = useState<EntityType | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<FieldGroup | null>(null);
  const [selectedField, setSelectedField] = useState<DynamicField | null>(null);
  const [showAddGroupModal, setShowAddGroupModal] = useState(false);
  const [showAddFieldModal, setShowAddFieldModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState<FieldGroup | null>(null);
  const [editingField, setEditingField] = useState<DynamicField | null>(null);

  const stats = useMemo(() => getFieldStatistics(), []);

  const filteredGroups = useMemo(() => {
    let filtered = [...demoFieldGroups];

    if (searchTerm) {
      filtered = filtered.filter(g =>
        g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedEntityType) {
      filtered = filtered.filter(g => g.entityType === selectedEntityType);
    }

    return filtered.sort((a, b) => a.order - b.order);
  }, [searchTerm, selectedEntityType]);

  const filteredFields = useMemo(() => {
    let filtered = [...demoDynamicFields];

    if (searchTerm) {
      filtered = filtered.filter(f =>
        f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedEntityType) {
      filtered = filtered.filter(f => f.entityType === selectedEntityType);
    }

    if (selectedGroup) {
      filtered = filtered.filter(f => f.groupId === selectedGroup.id);
    }

    return filtered.sort((a, b) => a.order - b.order);
  }, [searchTerm, selectedEntityType, selectedGroup]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Dinamik Alan Yönetimi
            </h1>
            <p className="text-gray-600 mt-2">Özel alan ve grup tanımlamaları yapın, formlarınızı özelleştirin</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all">
              <Download className="w-4 h-4" />
              Dışa Aktar
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
              <Upload className="w-4 h-4" />
              İçe Aktar
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={<Grid className="w-5 h-5" />}
            label="Toplam Grup"
            value={stats.totalGroups}
            color="purple"
          />
          <StatCard
            icon={<Settings className="w-5 h-5" />}
            label="Toplam Alan"
            value={stats.totalFields}
            color="blue"
          />
          <StatCard
            icon={<List className="w-5 h-5" />}
            label="Değer Sayısı"
            value={stats.totalValues}
            color="green"
          />
          <StatCard
            icon={<Type className="w-5 h-5" />}
            label="Alan Tipi"
            value={Object.keys(stats.fieldsByType).length}
            color="orange"
          />
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="bg-white rounded-xl shadow-sm p-2 mb-6 flex gap-2">
        <TabButton
          active={viewMode === 'groups'}
          onClick={() => setViewMode('groups')}
          icon={<Grid className="w-4 h-4" />}
          label="Gruplar"
        />
        <TabButton
          active={viewMode === 'fields'}
          onClick={() => setViewMode('fields')}
          icon={<Settings className="w-4 h-4" />}
          label="Alanlar"
        />
        <TabButton
          active={viewMode === 'templates'}
          onClick={() => setViewMode('templates')}
          icon={<Copy className="w-4 h-4" />}
          label="Şablonlar"
        />
        <TabButton
          active={viewMode === 'preview'}
          onClick={() => setViewMode('preview')}
          icon={<Eye className="w-4 h-4" />}
          label="Önizleme"
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <select
            value={selectedEntityType || ''}
            onChange={(e) => setSelectedEntityType((e.target.value as EntityType) || null)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Tüm Varlık Tipleri</option>
            {Object.entries(ENTITY_TYPE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>

          {viewMode === 'fields' && (
            <select
              value={selectedGroup?.id || ''}
              onChange={(e) => {
                const group = demoFieldGroups.find(g => g.id === e.target.value);
                setSelectedGroup(group || null);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Tüm Gruplar</option>
              {filteredGroups.map(group => (
                <option key={group.id} value={group.id}>
                  {group.icon} {group.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        {viewMode === 'groups' && (
          <GroupsView
            groups={filteredGroups}
            onAddNew={() => setShowAddGroupModal(true)}
            onEdit={(group) => {
              setEditingGroup(group);
              setShowAddGroupModal(true);
            }}
            onDelete={(group) => {
              if (confirm(`"${group.name}" grubunu silmek istediğinizden emin misiniz?`)) {
                alert('Grup silindi! (Demo)');
              }
            }}
            onViewFields={(group) => {
              setSelectedGroup(group);
              setViewMode('fields');
            }}
          />
        )}

        {viewMode === 'fields' && (
          <FieldsView
            fields={filteredFields}
            onAddNew={() => setShowAddFieldModal(true)}
            onEdit={(field) => {
              setEditingField(field);
              setShowAddFieldModal(true);
            }}
            onDelete={(field) => {
              if (confirm(`"${field.name}" alanını silmek istediğinizden emin misiniz?`)) {
                alert('Alan silindi! (Demo)');
              }
            }}
            onPreview={(field) => {
              setSelectedField(field);
              setShowPreviewModal(true);
            }}
          />
        )}

        {viewMode === 'templates' && (
          <TemplatesView
            templates={fieldTemplates}
            onUseTemplate={(template) => {
              alert(`"${template.name}" şablonu uygulandı! (Demo)`);
            }}
          />
        )}

        {viewMode === 'preview' && (
          <PreviewView
            entityType={selectedEntityType || 'student'}
          />
        )}
      </div>

      {/* Modals */}
      {showAddGroupModal && (
        <GroupModal
          group={editingGroup}
          onClose={() => {
            setShowAddGroupModal(false);
            setEditingGroup(null);
          }}
          onSave={() => {
            setShowAddGroupModal(false);
            setEditingGroup(null);
            alert('Grup kaydedildi! (Demo)');
          }}
        />
      )}

      {showAddFieldModal && (
        <FieldModal
          field={editingField}
          groups={filteredGroups}
          onClose={() => {
            setShowAddFieldModal(false);
            setEditingField(null);
          }}
          onSave={() => {
            setShowAddFieldModal(false);
            setEditingField(null);
            alert('Alan kaydedildi! (Demo)');
          }}
        />
      )}

      {showPreviewModal && selectedField && (
        <PreviewFieldModal
          field={selectedField}
          onClose={() => {
            setShowPreviewModal(false);
            setSelectedField(null);
          }}
        />
      )}
    </div>
  );
}

// ============================================
// SUB-COMPONENTS
// ============================================

function StatCard({ icon, label, value, color }: any) {
  const colorClasses: Record<string, string> = {
    purple: 'from-purple-500 to-purple-600',
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
      <div className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${colorClasses[color]} text-white mb-2`}>
        {icon}
      </div>
      <div className="text-2xl font-bold text-gray-800">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
        active ? 'bg-purple-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function GroupsView({ groups, onAddNew, onEdit, onDelete, onViewFields }: any) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Alan Grupları ({groups.length})</h2>
        <button
          onClick={onAddNew}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
        >
          <Plus className="w-4 h-4" />
          Yeni Grup
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((group: FieldGroup) => (
          <GroupCard
            key={group.id}
            group={group}
            onEdit={() => onEdit(group)}
            onDelete={() => onDelete(group)}
            onViewFields={() => onViewFields(group)}
          />
        ))}
      </div>
    </div>
  );
}

function GroupCard({ group, onEdit, onDelete, onViewFields }: any) {
  const fieldCount = getFieldsByGroup(group.id).length;

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{group.icon}</span>
          <div>
            <h3 className="font-bold text-gray-800">{group.name}</h3>
            <p className="text-xs text-gray-500">{group.code}</p>
          </div>
        </div>
        <span
          className="px-2 py-1 rounded text-xs font-medium"
          style={{ backgroundColor: group.color + '20', color: group.color }}
        >
          {ENTITY_TYPE_LABELS[group.entityType]}
        </span>
      </div>

      {group.description && (
        <p className="text-sm text-gray-600 mb-3">{group.description}</p>
      )}

      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
        <Settings className="w-4 h-4" />
        <span>{fieldCount} alan</span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onViewFields}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-purple-50 text-purple-600 rounded hover:bg-purple-100 transition-all"
        >
          <Eye className="w-4 h-4" />
          Alanlar
        </button>
        <button
          onClick={onEdit}
          className="flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-all"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={onDelete}
          className="flex items-center justify-center px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function FieldsView({ fields, onAddNew, onEdit, onDelete, onPreview }: any) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Dinamik Alanlar ({fields.length})</h2>
        <button
          onClick={onAddNew}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
        >
          <Plus className="w-4 h-4" />
          Yeni Alan
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Alan Adı</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Kod</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tip</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Varlık</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Zorunlu</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Görünür</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {fields.map((field: DynamicField) => (
              <tr key={field.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium">{field.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{field.code}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 text-sm">
                    {FIELD_TYPE_ICONS[field.fieldType]}
                    <span className="capitalize">{field.fieldType}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">{ENTITY_TYPE_LABELS[field.entityType]}</td>
                <td className="px-4 py-3">
                  {field.isRequired ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <X className="w-4 h-4 text-gray-400" />
                  )}
                </td>
                <td className="px-4 py-3">
                  {field.isVisible ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <X className="w-4 h-4 text-gray-400" />
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onPreview(field)}
                      className="text-purple-600 hover:text-purple-800"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(field)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(field)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TemplatesView({ templates, onUseTemplate }: any) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Alan Şablonları ({templates.length})</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template: any) => (
          <div key={template.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-gray-800">{template.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{template.description}</p>
              </div>
              {template.isSystemTemplate && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                  Sistem
                </span>
              )}
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Grid className="w-4 h-4" />
                <span>{template.groups.length} grup</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Settings className="w-4 h-4" />
                <span>{template.fields.length} alan</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Copy className="w-4 h-4" />
                <span>{template.usageCount} kez kullanıldı</span>
              </div>
            </div>

            <button
              onClick={() => onUseTemplate(template)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
            >
              <Copy className="w-4 h-4" />
              Şablonu Kullan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function PreviewView({ entityType }: { entityType: EntityType }) {
  const groups = getGroupsByEntity(entityType);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(groups.map(g => g.id)));

  const toggleGroup = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Form Önizleme</h2>
        <p className="text-gray-600">
          {ENTITY_TYPE_LABELS[entityType]} formu önizlemesi
        </p>
      </div>

      <div className="max-w-4xl space-y-4">
        {groups.map(group => {
          const fields = getFieldsByGroup(group.id);
          const isExpanded = expandedGroups.has(group.id);

          return (
            <div key={group.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <div
                onClick={() => toggleGroup(group.id)}
                className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                style={{ borderLeftWidth: '4px', borderLeftColor: group.color }}
              >
                <div className="flex items-center gap-3">
                  {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  <span className="text-2xl">{group.icon}</span>
                  <div>
                    <h3 className="font-bold text-gray-800">{group.name}</h3>
                    {group.description && (
                      <p className="text-sm text-gray-600">{group.description}</p>
                    )}
                  </div>
                </div>
                <span className="text-sm text-gray-500">{fields.length} alan</span>
              </div>

              {isExpanded && (
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {fields.filter(f => f.isVisible).map(field => (
                      <div
                        key={field.id}
                        className={field.width === 'full' ? 'md:col-span-2' : ''}
                      >
                        <DynamicFieldPreview field={field} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DynamicFieldPreview({ field }: { field: DynamicField }) {
  const [value, setValue] = useState(field.defaultValue || '');

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {field.name}
        {field.isRequired && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Render different input types */}
      {field.fieldType === 'text' && (
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={field.placeholder}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
        />
      )}

      {field.fieldType === 'number' && (
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={field.placeholder}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
        />
      )}

      {field.fieldType === 'textarea' && (
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={field.placeholder}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
        />
      )}

      {field.fieldType === 'select' && (
        <select
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Seçiniz...</option>
          {field.options?.map(opt => (
            <option key={opt.id} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      )}

      {field.fieldType === 'radio' && (
        <div className="space-y-2">
          {field.options?.map(opt => (
            <label key={opt.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={field.id}
                value={opt.value}
                checked={value === opt.value}
                onChange={(e) => setValue(e.target.value)}
                className="w-4 h-4 text-purple-600"
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      )}

      {field.fieldType === 'checkbox' && (
        <div className="space-y-2">
          {field.options?.map(opt => (
            <label key={opt.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-purple-600 rounded"
              />
              <span>{opt.icon} {opt.label}</span>
            </label>
          ))}
        </div>
      )}

      {field.helpText && (
        <p className="mt-1 text-sm text-gray-500">{field.helpText}</p>
      )}
    </div>
  );
}

// ... Modals (GroupModal, FieldModal, PreviewFieldModal) simplified for brevity
function GroupModal({ group, onClose, onSave }: any) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            {group ? 'Grup Düzenle' : 'Yeni Grup Ekle'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <input
            type="text"
            placeholder="Grup Kodu"
            defaultValue={group?.code}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="text"
            placeholder="Grup Adı"
            defaultValue={group?.name}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
          <textarea
            placeholder="Açıklama"
            defaultValue={group?.description}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
          <select
            defaultValue={group?.entityType}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Varlık Tipi Seçiniz</option>
            {Object.entries(ENTITY_TYPE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="İkon (emoji)"
            defaultValue={group?.icon}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="color"
            defaultValue={group?.color || '#8B5CF6'}
            className="w-full h-12 border border-gray-300 rounded-lg"
          />
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
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
          >
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}

function FieldModal({ field, groups, onClose, onSave }: any) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            {field ? 'Alan Düzenle' : 'Yeni Alan Ekle'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Alan Kodu" defaultValue={field?.code} className="px-4 py-2 border rounded-lg" />
            <input type="text" placeholder="Alan Adı" defaultValue={field?.name} className="px-4 py-2 border rounded-lg" />
          </div>
          <textarea placeholder="Açıklama" defaultValue={field?.description} rows={2} className="w-full px-4 py-2 border rounded-lg" />
          <div className="grid grid-cols-3 gap-4">
            <select defaultValue={field?.groupId} className="px-4 py-2 border rounded-lg">
              <option value="">Grup Seçiniz</option>
              {groups.map((g: any) => (
                <option key={g.id} value={g.id}>{g.icon} {g.name}</option>
              ))}
            </select>
            <select defaultValue={field?.fieldType} className="px-4 py-2 border rounded-lg">
              <option value="">Alan Tipi</option>
              {Object.keys(FIELD_TYPE_ICONS).map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <select defaultValue={field?.entityType} className="px-4 py-2 border rounded-lg">
              <option value="">Varlık Tipi</option>
              {Object.entries(ENTITY_TYPE_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          
          <div className="flex gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked={field?.isRequired} className="w-4 h-4 rounded" />
              Zorunlu
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked={field?.isVisible} className="w-4 h-4 rounded" />
              Görünür
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked={field?.isSearchable} className="w-4 h-4 rounded" />
              Aranabilir
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked={field?.isFilterable} className="w-4 h-4 rounded" />
              Filtrelenebilir
            </label>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
          <button onClick={onClose} className="px-6 py-2 border rounded-lg">İptal</button>
          <button onClick={onSave} className="px-6 py-2 bg-purple-600 text-white rounded-lg">Kaydet</button>
        </div>
      </div>
    </div>
  );
}

function PreviewFieldModal({ field, onClose }: any) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
        <div className="border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Alan Önizleme</h2>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6">
          <DynamicFieldPreview field={field} />
        </div>
        <div className="border-t px-6 py-4 bg-gray-50">
          <button onClick={onClose} className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg">Kapat</button>
        </div>
      </div>
    </div>
  );
}

