import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, FolderOpen, BookOpen, ClipboardList, HelpCircle, FileText,
  BarChart3, Trophy, Settings, Upload, Sparkles, Plus, FileCheck, Database,
  TrendingUp, Users, Brain, PenTool, Search, Building, ChevronDown, ChevronRight,
  Menu, X, Shield, Book, GraduationCap, DollarSign, CreditCard, Calendar,
  Key, Package, Coins, MessageSquare, Plug, Activity, MapPin, Wand2, FileEdit,
  Image, BookMarked, Presentation, Cpu, FileSearch, Library, Network,
  FileBarChart, Link2, Award, List, Zap, Code, Monitor
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
  Menu, X, ChevronDown, ChevronRight, Award, List, Zap, Code, Monitor,
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

  // Debug logging
  console.log('🎨 Sidebar - Loading:', loading);
  console.log('🎨 Sidebar - Error:', error);
  console.log('🎨 Sidebar - Menu Items:', menuItems);
  console.log('🎨 Sidebar - Menu Items Count:', menuItems.length);

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

    // Divider type - only show if not collapsed
    if (item.menu_type === 'divider') {
      if (isCollapsed) return null;
      return <div key={item.menu_id} className="my-3 border-t border-gray-200 dark:border-gray-700" />;
    }

    // Group header type - only show if not collapsed
    if (item.menu_type === 'group') {
      if (isCollapsed) return null;
      return (
        <div key={item.menu_id} className="px-4 pt-4 pb-2">
          {!isCollapsed && item.icon_name && (
            <div className="flex items-center gap-2 mb-1">
              {renderIcon(item.icon_name, 'w-4 h-4 text-gray-400')}
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {item.label}
              </span>
            </div>
          )}
          {!isCollapsed && !item.icon_name && (
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {item.label}
            </span>
          )}
        </div>
      );
    }

    // Calculate indentation for nested items
    const indentClass = level > 0 && !isCollapsed ? `ml-${Math.min(level * 4, 12)}` : '';
    const textSizeClass = level > 0 ? 'text-sm' : 'text-base';

    return (
      <div key={item.menu_id} className="mb-0.5">
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
          title={isCollapsed ? item.label : undefined}
          className={`
            flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
            ${active 
              ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md' 
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }
            ${indentClass}
            ${textSizeClass}
            ${isCollapsed ? 'justify-center' : ''}
            group relative
          `}
        >
          {/* Icon with better spacing */}
          <div className={`flex-shrink-0 ${active ? 'text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-blue-600'}`}>
            {renderIcon(item.icon_name, `w-5 h-5 transition-colors`)}
          </div>
          
          {!isCollapsed && (
            <>
              {/* Label */}
              <span className="flex-1 font-medium">{item.label}</span>
              
              {/* Badge */}
              {item.badge_text && (
                <span className={`
                  px-2 py-0.5 text-xs font-semibold rounded-full 
                  ${getBadgeColor(item.badge_color)} text-white
                  shadow-sm
                `}>
                  {item.badge_text}
                </span>
              )}
              
              {/* Dropdown indicator */}
              {hasChildren && (
                <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-0' : '-rotate-90'}`}>
                  <ChevronDown size={16} className={active ? 'text-white' : 'text-gray-400'} />
                </div>
              )}
            </>
          )}

          {/* Tooltip for collapsed state */}
          {isCollapsed && (
            <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
              {item.label}
              {item.badge_text && (
                <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${getBadgeColor(item.badge_color)}`}>
                  {item.badge_text}
                </span>
              )}
            </div>
          )}
        </Link>

        {/* Render children with smooth animation */}
        {hasChildren && isExpanded && !isCollapsed && (
          <div className="mt-0.5 space-y-0.5 animate-slideDown">
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
          <nav className="flex-1 overflow-y-auto p-3 space-y-0.5 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
            {menuItems.length === 0 ? (
              <div className="text-center text-gray-500 text-sm py-8">
                <p>{t('noMenuItems')}</p>
              </div>
            ) : (
              menuItems.map(item => renderMenuItem(item))
            )}
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

