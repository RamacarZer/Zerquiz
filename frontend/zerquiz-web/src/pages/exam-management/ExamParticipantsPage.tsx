/**
 * Exam Participants & Proctors Management
 * Sınav Katılımcı ve Gözetmen Yönetimi
 */

import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Users, UserCheck, UserPlus, Search, Filter, Download, Upload,
  Mail, Phone, MapPin, Calendar, Clock, CheckCircle, XCircle,
  AlertCircle, Eye, Edit, Trash2, Send, FileText, Printer,
  Shield, Award, BarChart3, TrendingUp,
} from 'lucide-react';
import { demoExams, ExamDefinition } from '../../mocks/examSystemData';
import { demoStudents, institutions } from '../../mocks/locationHierarchyData';

type TabType = 'participants' | 'proctors' | 'entry-cards' | 'analytics';

interface Participant {
  id: string;
  studentId: string;
  studentName: string;
  studentNumber: string;
  email: string;
  phone?: string;
  institutionId: string;
  institutionName: string;
  grade: string;
  registeredAt: string;
  status: 'registered' | 'confirmed' | 'attended' | 'absent' | 'cancelled';
  seatNumber?: string;
  entryCardGenerated: boolean;
  specialNeeds?: string[];
}

interface Proctor {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'chief' | 'assistant' | 'tech';
  location: string;
  assignedRooms: string[];
  certifications: string[];
  status: 'assigned' | 'confirmed' | 'active' | 'completed';
}

export default function ExamParticipantsPage() {
  const { id: examId } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<TabType>('participants');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedParticipants, setSelectedParticipants] = useState<Set<string>>(new Set());

  // Load exam
  const exam = demoExams.find(e => e.id === examId);

  // Mock participants data
  const participants: Participant[] = useMemo(() => {
    return demoStudents.slice(0, 50).map((student, idx) => ({
      id: `participant-${idx + 1}`,
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      studentNumber: student.studentNumber,
      email: student.email,
      phone: student.phone,
      institutionId: student.institutionId,
      institutionName: student.institutionName,
      grade: student.grade || '12',
      registeredAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: ['registered', 'confirmed', 'attended', 'absent'][Math.floor(Math.random() * 4)] as any,
      seatNumber: idx < 40 ? `A-${idx + 1}` : undefined,
      entryCardGenerated: idx < 35,
      specialNeeds: Math.random() > 0.9 ? ['Özel süre', 'Büyük punto'] : undefined,
    }));
  }, []);

  // Mock proctors data
  const proctors: Proctor[] = [
    {
      id: 'proctor-1',
      name: 'Prof. Dr. Mehmet Yılmaz',
      email: 'mehmet.yilmaz@email.com',
      phone: '+90 532 123 45 67',
      role: 'chief',
      location: 'A Blok - Ana Salon',
      assignedRooms: ['A-101', 'A-102', 'A-103'],
      certifications: ['MEB Gözetmen', 'Sınav Koordinatörü'],
      status: 'confirmed',
    },
    {
      id: 'proctor-2',
      name: 'Öğr. Gör. Ayşe Demir',
      email: 'ayse.demir@email.com',
      phone: '+90 543 234 56 78',
      role: 'assistant',
      location: 'B Blok',
      assignedRooms: ['B-201', 'B-202'],
      certifications: ['MEB Gözetmen'],
      status: 'assigned',
    },
    {
      id: 'proctor-3',
      name: 'Tekn. Ali Kaya',
      email: 'ali.kaya@email.com',
      phone: '+90 555 345 67 89',
      role: 'tech',
      location: 'Bilgisayar Lab',
      assignedRooms: ['LAB-1', 'LAB-2'],
      certifications: ['Teknik Destek', 'Bilgisayar Ağları'],
      status: 'confirmed',
    },
  ];

  const filteredParticipants = useMemo(() => {
    let filtered = [...participants];

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.studentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(p => p.status === filterStatus);
    }

    return filtered;
  }, [participants, searchTerm, filterStatus]);

  const stats = {
    total: participants.length,
    registered: participants.filter(p => p.status === 'registered').length,
    confirmed: participants.filter(p => p.status === 'confirmed').length,
    attended: participants.filter(p => p.status === 'attended').length,
    absent: participants.filter(p => p.status === 'absent').length,
    proctors: proctors.length,
    entryCards: participants.filter(p => p.entryCardGenerated).length,
  };

  if (!exam) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-xl text-gray-600">Sınav bulunamadı</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {exam.title}
            </h1>
            <p className="text-gray-600 mt-2">Katılımcı ve gözetmen yönetimi</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <Upload className="w-4 h-4" />
              İçe Aktar
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              <Download className="w-4 h-4" />
              Dışa Aktar
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <StatCard icon={<Users />} label="Toplam" value={stats.total} color="blue" />
          <StatCard icon={<UserPlus />} label="Kayıtlı" value={stats.registered} color="gray" />
          <StatCard icon={<UserCheck />} label="Onaylı" value={stats.confirmed} color="green" />
          <StatCard icon={<CheckCircle />} label="Katıldı" value={stats.attended} color="purple" />
          <StatCard icon={<XCircle />} label="Devamsız" value={stats.absent} color="red" />
          <StatCard icon={<Shield />} label="Gözetmen" value={stats.proctors} color="orange" />
          <StatCard icon={<FileText />} label="Giriş Kartı" value={stats.entryCards} color="cyan" />
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm p-2 mb-6 flex gap-2 overflow-x-auto">
        <TabButton
          active={activeTab === 'participants'}
          onClick={() => setActiveTab('participants')}
          icon={<Users className="w-4 h-4" />}
          label="Katılımcılar"
          count={stats.total}
        />
        <TabButton
          active={activeTab === 'proctors'}
          onClick={() => setActiveTab('proctors')}
          icon={<Shield className="w-4 h-4" />}
          label="Gözetmenler"
          count={stats.proctors}
        />
        <TabButton
          active={activeTab === 'entry-cards'}
          onClick={() => setActiveTab('entry-cards')}
          icon={<FileText className="w-4 h-4" />}
          label="Giriş Kartları"
        />
        <TabButton
          active={activeTab === 'analytics'}
          onClick={() => setActiveTab('analytics')}
          icon={<BarChart3 className="w-4 h-4" />}
          label="Analiz"
        />
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        {activeTab === 'participants' && (
          <ParticipantsTab
            participants={filteredParticipants}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            selectedParticipants={selectedParticipants}
            setSelectedParticipants={setSelectedParticipants}
          />
        )}

        {activeTab === 'proctors' && (
          <ProctorsTab proctors={proctors} />
        )}

        {activeTab === 'entry-cards' && (
          <EntryCardsTab participants={participants} exam={exam} />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsTab participants={participants} exam={exam} />
        )}
      </div>
    </div>
  );
}

// ============================================
// SUB-COMPONENTS
// ============================================

function StatCard({ icon, label, value, color }: any) {
  const colorClasses: Record<string, string> = {
    blue: 'from-blue-500 to-blue-600',
    gray: 'from-gray-500 to-gray-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    red: 'from-red-500 to-red-600',
    orange: 'from-orange-500 to-orange-600',
    cyan: 'from-cyan-500 to-cyan-600',
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
      <div className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${colorClasses[color]} text-white mb-2`}>
        {React.cloneElement(icon, { className: 'w-5 h-5' })}
      </div>
      <div className="text-2xl font-bold text-gray-800">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label, count }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
        active ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {icon}
      {label}
      {count !== undefined && (
        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
          active ? 'bg-white/20' : 'bg-gray-200'
        }`}>
          {count}
        </span>
      )}
    </button>
  );
}

function ParticipantsTab({ participants, searchTerm, setSearchTerm, filterStatus, setFilterStatus, selectedParticipants, setSelectedParticipants }: any) {
  const handleSelectAll = () => {
    if (selectedParticipants.size === participants.length) {
      setSelectedParticipants(new Set());
    } else {
      setSelectedParticipants(new Set(participants.map((p: Participant) => p.id)));
    }
  };

  const handleBulkAction = (action: string) => {
    alert(`${action} işlemi ${selectedParticipants.size} katılımcı için uygulanacak`);
  };

  return (
    <div>
      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Öğrenci ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tüm Durumlar</option>
            <option value="registered">Kayıtlı</option>
            <option value="confirmed">Onaylı</option>
            <option value="attended">Katıldı</option>
            <option value="absent">Devamsız</option>
          </select>
        </div>

        {/* Bulk Actions */}
        {selectedParticipants.size > 0 && (
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <span className="text-sm font-medium text-blue-900">
              {selectedParticipants.size} katılımcı seçildi
            </span>
            <button
              onClick={() => handleBulkAction('Email Gönder')}
              className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              <Mail className="w-4 h-4" />
              Email Gönder
            </button>
            <button
              onClick={() => handleBulkAction('Giriş Kartı Oluştur')}
              className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
            >
              <FileText className="w-4 h-4" />
              Giriş Kartı
            </button>
            <button
              onClick={() => setSelectedParticipants(new Set())}
              className="ml-auto text-sm text-gray-600 hover:text-gray-800"
            >
              Seçimi Temizle
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedParticipants.size === participants.length}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded"
                />
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">No</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Ad Soyad</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Kurum</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Sınıf</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Koltuk</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Durum</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Giriş Kartı</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {participants.map((participant: Participant, idx: number) => (
              <tr key={participant.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedParticipants.has(participant.id)}
                    onChange={() => {
                      const newSelected = new Set(selectedParticipants);
                      if (newSelected.has(participant.id)) {
                        newSelected.delete(participant.id);
                      } else {
                        newSelected.add(participant.id);
                      }
                      setSelectedParticipants(newSelected);
                    }}
                    className="w-4 h-4 rounded"
                  />
                </td>
                <td className="px-4 py-3 text-sm">{participant.studentNumber}</td>
                <td className="px-4 py-3">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{participant.studentName}</div>
                    <div className="text-xs text-gray-500">{participant.email}</div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">{participant.institutionName}</td>
                <td className="px-4 py-3 text-sm">{participant.grade}</td>
                <td className="px-4 py-3 text-sm font-medium">{participant.seatNumber || '-'}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    participant.status === 'registered' ? 'bg-gray-100 text-gray-700' :
                    participant.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                    participant.status === 'attended' ? 'bg-green-100 text-green-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {participant.status === 'registered' ? 'Kayıtlı' :
                     participant.status === 'confirmed' ? 'Onaylı' :
                     participant.status === 'attended' ? 'Katıldı' : 'Devamsız'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {participant.entryCardGenerated ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-gray-300" />
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-800">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-800">
                      <Printer className="w-4 h-4" />
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

function ProctorsTab({ proctors }: { proctors: Proctor[] }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Gözetmen Listesi ({proctors.length})</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <UserPlus className="w-4 h-4" />
          Gözetmen Ekle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {proctors.map(proctor => (
          <ProctorCard key={proctor.id} proctor={proctor} />
        ))}
      </div>
    </div>
  );
}

function ProctorCard({ proctor }: { proctor: Proctor }) {
  const roleColors = {
    chief: 'from-purple-500 to-purple-600',
    assistant: 'from-blue-500 to-blue-600',
    tech: 'from-green-500 to-green-600',
  };

  const roleLabels = {
    chief: 'Baş Gözetmen',
    assistant: 'Yardımcı Gözetmen',
    tech: 'Teknik Destek',
  };

  return (
    <div className="border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-all">
      <div className="flex items-start gap-3 mb-4">
        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${roleColors[proctor.role]} flex items-center justify-center text-white font-bold text-lg`}>
          {proctor.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-800">{proctor.name}</h3>
          <p className="text-sm text-gray-600">{roleLabels[proctor.role]}</p>
        </div>
      </div>

      <div className="space-y-2 text-sm mb-4">
        <div className="flex items-center gap-2 text-gray-600">
          <Mail className="w-4 h-4" />
          <span>{proctor.email}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Phone className="w-4 h-4" />
          <span>{proctor.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{proctor.location}</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-xs text-gray-500 mb-2">Sorumlu Salonlar:</div>
        <div className="flex flex-wrap gap-1">
          {proctor.assignedRooms.map(room => (
            <span key={room} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
              {room}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <div className="text-xs text-gray-500 mb-2">Sertifikalar:</div>
        <div className="flex flex-wrap gap-1">
          {proctor.certifications.map(cert => (
            <span key={cert} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
              {cert}
            </span>
          ))}
        </div>
      </div>

      <span className={`inline-block px-3 py-1 rounded text-xs font-medium ${
        proctor.status === 'assigned' ? 'bg-gray-100 text-gray-700' :
        proctor.status === 'confirmed' ? 'bg-green-100 text-green-700' :
        proctor.status === 'active' ? 'bg-blue-100 text-blue-700' :
        'bg-purple-100 text-purple-700'
      }`}>
        {proctor.status === 'assigned' ? 'Atandı' :
         proctor.status === 'confirmed' ? 'Onaylandı' :
         proctor.status === 'active' ? 'Aktif' : 'Tamamlandı'}
      </span>
    </div>
  );
}

function EntryCardsTab({ participants, exam }: any) {
  const handleGenerateAll = () => {
    alert('Tüm giriş kartları oluşturuluyor...');
  };

  const handlePrintAll = () => {
    alert('Tüm giriş kartları yazdırılıyor...');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Sınav Giriş Kartları</h2>
        <div className="flex gap-3">
          <button
            onClick={handleGenerateAll}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <FileText className="w-4 h-4" />
            Tümünü Oluştur
          </button>
          <button
            onClick={handlePrintAll}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Printer className="w-4 h-4" />
            Toplu Yazdır
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {participants.slice(0, 12).map((participant: Participant) => (
          <EntryCard key={participant.id} participant={participant} exam={exam} />
        ))}
      </div>
    </div>
  );
}

function EntryCard({ participant, exam }: any) {
  return (
    <div className="border-2 border-gray-300 rounded-lg p-4 bg-white hover:shadow-lg transition-all">
      <div className="text-center mb-4 pb-4 border-b-2 border-dashed">
        <h3 className="font-bold text-lg text-gray-800">{exam.title}</h3>
        <p className="text-sm text-gray-600">{exam.subject}</p>
      </div>

      <div className="space-y-3 mb-4">
        <div>
          <div className="text-xs text-gray-500">Öğrenci Adı</div>
          <div className="font-bold text-gray-800">{participant.studentName}</div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-xs text-gray-500">Öğrenci No</div>
            <div className="font-medium text-gray-800">{participant.studentNumber}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Koltuk No</div>
            <div className="font-bold text-blue-600 text-lg">{participant.seatNumber || 'Atanmadı'}</div>
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Kurum</div>
          <div className="text-sm text-gray-700">{participant.institutionName}</div>
        </div>
      </div>

      <div className="pt-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Tarih: {exam.scheduledStart && new Date(exam.scheduledStart).toLocaleDateString('tr-TR')}</span>
          <span>Süre: {exam.duration} dk</span>
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
          <Printer className="w-4 h-4 mx-auto" />
        </button>
        <button className="flex-1 px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700">
          <Download className="w-4 h-4 mx-auto" />
        </button>
      </div>
    </div>
  );
}

function AnalyticsTab({ participants, exam }: any) {
  const byInstitution = participants.reduce((acc: any, p: Participant) => {
    acc[p.institutionName] = (acc[p.institutionName] || 0) + 1;
    return acc;
  }, {});

  const byStatus = participants.reduce((acc: any, p: Participant) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Katılımcı Analizi</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Kurum Bazlı Dağılım</h3>
          <div className="space-y-3">
            {Object.entries(byInstitution).map(([inst, count]: any) => (
              <div key={inst}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{inst}</span>
                  <span className="font-medium">{count}</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${(count / participants.length) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Durum Bazlı Dağılım</h3>
          <div className="space-y-3">
            {Object.entries(byStatus).map(([status, count]: any) => (
              <div key={status}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700 capitalize">{status}</span>
                  <span className="font-medium">{count}</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-green-600 rounded-full"
                    style={{ width: `${(count / participants.length) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

