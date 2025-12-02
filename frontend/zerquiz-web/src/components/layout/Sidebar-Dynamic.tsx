import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, FolderOpen, BookOpen, ClipboardList, HelpCircle, FileText,
  BarChart3, Trophy, Settings, Upload, Sparkles, Plus, FileCheck, Database,
  TrendingUp, Users, Brain, PenTool, Search, Building, ChevronDown, ChevronRight,
  Menu, X, Shield, Book, GraduationCap, DollarSign, CreditCard, Calendar,
  Key, Package, Coins, MessageSquare, Plug, Activity, MapPin, Wand2, FileEdit,
  Image, BookMarked, Presentation, Cpu, FileSearch, Library, Network,
  FileBarChart, Link2
} from 'lucide-react';
import { useDynamicMenu } from '../../hooks/useDynamicMenu';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';

// Icon mapping - comprehensive list
const iconMap: Record<string, React.ComponentType<any>> = {
  LayoutDashboard, FolderOpen, BookOpen, ClipboardList, HelpCircle, FileText,
  BarChart3, Trophy, Settings, Upload, Sparkles, Plus, FileCheck, Database,
  TrendingUp, Users, Brain, PenTool, Search, Building, Shield, Book,
  GraduationCap, DollarSign, CreditCard, Calendar, Key, Package, Coins,
  MessageSquare, Plug, Activity, MapPin, Wand2, FileEdit, Image, BookMarked,
  Presentation, Cpu, FileSearch, Library, Network, FileBarChart, Link2,
  Menu, X, ChevronDown, ChevronRight,
};

interface MenuItem {
  menu_id: string;
  menu_code: string;
  parent_menu_id?: string;
  label: string;
  icon_name?: string;
  path?: string;
  display_order: number;
  level: number;
  menu_type: 'link' | 'dropdown' | 'divider' | 'group';
  badge_text?: string;
  badge_color?: string;
  has_children: boolean;
  module_code?: string;
  children: MenuItem[];
}

interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({ isCollapsed: externalCollapsed, onToggleCollapse }: SidebarProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const { menuItems, loading, error } = useDynamicMenu();
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isCollapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;

  const toggleCollapse = () => {
    if (onToggleCollapse) {
      onToggleCollapse();
    } else {
      setInternalCollapsed(!internalCollapsed);
    }
  };

  const toggleExpand = (menuCode: string) => {
    setExpandedItems(prev =>
      prev.includes(menuCode) ? prev.filter(code => code !== menuCode) : [...prev, menuCode]
    );
  };

  const renderIcon = (iconName?: string, className: string = '') => {
    if (!iconName) return <HelpCircle className={className} />;
    const Icon = iconMap[iconName] || HelpCircle;
    return <Icon className={className} />;
  };

  const isActive = (path?: string) => {
    if (!path) return false;
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const getBadgeColor = (color?: string) => {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-500',
      purple: 'bg-purple-500',
      green: 'bg-green-500',
      red: 'bg-red-500',
      orange: 'bg-orange-500',
      yellow: 'bg-yellow-500',
    };
    return colorMap[color || 'blue'] || 'bg-blue-500';
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.menu_code);
    const active = isActive(item.path);

    // Divider type
    if (item.menu_type === 'divider') {
      return <div key={item.menu_id} className="my-4 border-t border-gray-200 dark:border-gray-700" />;
    }

    // Group header type
    if (item.menu_type === 'group') {
      return (
        <div key={item.menu_id} className="px-4 pt-4 pb-2">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {item.label}
          </span>
        </div>
      );
    }

    return (
      <div key={item.menu_id} className="mb-1">
        <Link
          to={!hasChildren ? (item.path || '#') : '#'}
          onClick={(e) => {
            if (hasChildren) {
              e.preventDefault();
              toggleExpand(item.menu_code);
            } else {
              setIsMobileMenuOpen(false);
            }
          }}
          className={`
            flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all
            ${active ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}
            ${level > 0 ? 'ml-4 text-sm' : ''}
            ${isCollapsed ? 'justify-center' : ''}
          `}
        >
          {renderIcon(item.icon_name, `w-5 h-5 ${active ? 'text-white' : ''}`)}
          
          {!isCollapsed && (
            <>
              <span className="flex-1">{item.label}</span>
              
              {item.badge_text && (
                <span className={`px-2 py-0.5 text-xs rounded-full ${getBadgeColor(item.badge_color)} text-white`}>
                  {item.badge_text}
                </span>
              )}
              
              {hasChildren && (
                isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />
              )}
            </>
          )}
        </Link>

        {/* Render children */}
        {hasChildren && isExpanded && !isCollapsed && (
          <div className="mt-1">
            {item.children.map(child => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <aside className={`bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
        <div className="flex flex-col h-full p-4">
          <div className="animate-pulse space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            ))}
          </div>
        </div>
      </aside>
    );
  }

  // Error state
  if (error) {
    return (
      <aside className={`bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
        <div className="flex flex-col h-full p-4">
          <div className="text-red-500 text-sm">
            <p>{t('error')}: {error}</p>
            <p className="text-xs mt-2">{t('menuLoadFailed')}</p>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative inset-y-0 left-0 z-40
          bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
          transition-all duration-300
          ${isCollapsed ? 'w-16' : 'w-64'}
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className={`flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 ${isCollapsed ? 'justify-center' : ''}`}>
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                <Shield className="w-8 h-8 text-blue-600" />
                <span className="font-bold text-xl">Zerquiz</span>
              </div>
            )}
            <button
              onClick={toggleCollapse}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 hidden lg:block"
            >
              {isCollapsed ? <ChevronRight size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* User Info */}
          {!isCollapsed && user && (
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                  {user.name?.[0] || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {menuItems.map(item => renderMenuItem(item))}
          </nav>

          {/* Footer - Collapse Button */}
          {!isCollapsed && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
              <Link
                to="/settings"
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              >
                <Settings className="w-5 h-5" />
                <span>{t('settings')}</span>
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

