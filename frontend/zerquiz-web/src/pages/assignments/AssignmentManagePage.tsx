// Assignment Management Page - For teachers to create and manage assignments

import { useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { 
  Plus, Search, Filter, Calendar, Clock, Users, 
  CheckCircle, AlertCircle, Eye, Edit, Trash2, Download
} from 'lucide-react';

interface Assignment {
  id: string;
  title: string;
  subject: string;
  class: string;
  dueDate: string;
  points: number;
  status: 'active' | 'closed' | 'draft';
  submitted: number;
  total: number;
  avgScore?: number;
}

const mockAssignments: Assignment[] = [
  {
    id: '1',
    title: 'Machine Learning Project',
    subject: 'Computer Science',
    class: '12-A',
    dueDate: '2025-12-05',
    points: 100,
    status: 'active',
    submitted: 18,
    total: 28,
    avgScore: 85,
  },
  {
    id: '2',
    title: 'Cell Biology Lab Report',
    subject: 'Biology',
    class: '10-B',
    dueDate: '2025-12-03',
    points: 50,
    status: 'active',
    submitted: 25,
    total: 32,
    avgScore: 78,
  },
  {
    id: '3',
    title: 'Essay: Industrial Revolution',
    subject: 'History',
    class: '11-C',
    dueDate: '2025-11-28',
    points: 75,
    status: 'closed',
    submitted: 30,
    total: 30,
    avgScore: 82,
  },
];

export default function AssignmentManagePage() {
  const { t } = useLanguage();
  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'closed' | 'draft'>('all');

  const getStatusBadge = (status: string) => {
    const badges = {
      active: { bg: 'bg-green-100 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-400', label: 'Active' },
      closed: { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-700 dark:text-gray-400', label: 'Closed' },
      draft: { bg: 'bg-yellow-100 dark:bg-yellow-900/20', text: 'text-yellow-700 dark:text-yellow-400', label: 'Draft' },
    };
    const badge = badges[status as keyof typeof badges];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  const getSubmissionRate = (submitted: number, total: number) => {
    const rate = (submitted / total) * 100;
    return {
      percentage: rate,
      color: rate >= 80 ? 'text-green-600' : rate >= 50 ? 'text-yellow-600' : 'text-red-600',
    };
  };

  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || assignment.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            {t('assignments')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create, manage, and grade student assignments
          </p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg font-semibold hover:from-green-600 hover:to-teal-600 transition-all shadow-lg">
          <Plus className="w-5 h-5" />
          Create Assignment
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Assignments', value: '24', icon: CheckCircle, color: 'bg-blue-500' },
          { label: 'Active', value: '8', icon: Clock, color: 'bg-green-500' },
          { label: 'Pending Review', value: '45', icon: AlertCircle, color: 'bg-orange-500' },
          { label: 'Avg Score', value: '81%', icon: Users, color: 'bg-purple-500' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search assignments..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'active', 'closed', 'draft'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`
                  px-4 py-2 rounded-lg font-medium transition-all
                  ${filterStatus === status
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }
                `}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {filteredAssignments.map((assignment) => {
          const submissionRate = getSubmissionRate(assignment.submitted, assignment.total);
          return (
            <div
              key={assignment.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                      {assignment.title}
                    </h3>
                    {getStatusBadge(assignment.status)}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {assignment.subject} • Class {assignment.class} • {assignment.points} points
                  </p>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">Due Date</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    {assignment.dueDate}
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">Submissions</span>
                  </div>
                  <p className={`text-sm font-semibold ${submissionRate.color}`}>
                    {assignment.submitted}/{assignment.total} ({submissionRate.percentage.toFixed(0)}%)
                  </p>
                </div>

                {assignment.avgScore && (
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">Avg Score</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">
                      {assignment.avgScore}%
                    </p>
                  </div>
                )}

                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">Status</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    {assignment.status === 'active' ? 'In Progress' : 'Completed'}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              {assignment.status === 'active' && (
                <div className="mb-4">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-teal-500 h-2 rounded-full transition-all"
                      style={{ width: `${submissionRate.percentage}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                  <Eye className="w-4 h-4" />
                  View Submissions
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <Download className="w-4 h-4" />
                  Export
                </button>
                <button className="ml-auto p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredAssignments.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-12 shadow-lg border border-gray-100 dark:border-gray-700 text-center">
          <CheckCircle className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            No assignments found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Try adjusting your search or create a new assignment
          </p>
          <button className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors">
            Create First Assignment
          </button>
        </div>
      )}
    </div>
  );
}
