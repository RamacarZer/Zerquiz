import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, FolderOpen, BookOpen, ClipboardList, HelpCircle, FileText,
  BarChart3, Bot, Trophy, Settings, Upload, Sparkles, List, Layout, Plus,
  FileCheck, Database, FilePlus, TrendingUp, Users, Brain, PenTool, Search,
  Zap, Award, Building, ChevronDown, ChevronRight, Menu, X, Bell, User, Shield, Book,
  Monitor, GraduationCap, DollarSign, CreditCard, Calendar, Key, Package, Coins,
  FileSignature, MessageSquare, Plug, Link2, Activity, MapPin, Library, Wand2,
  FileSearch, Code, CheckSquare, UserPlus, FileBarChart, BookPlus, FileQuestion,
  Presentation, Copyright, Wallet, Receipt, PieChart, Plane, BookMarked, Palette,
  Calculator, BookText, ClipboardCheck, KeyRound, BarChart2
} from 'lucide-react';
import { getFilteredMenu, getMenuLabel, getQuickActions, MenuItem } from '../../config/navigation';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';

// Icon mapping
const iconMap: Record<string, React.ComponentType<any>> = {
  LayoutDashboard, FolderOpen, BookOpen, ClipboardList, HelpCircle, FileText,
  BarChart3, Bot, Trophy, Settings, Upload, Sparkles, List, Layout, Plus,
  FileCheck, Database, FilePlus, TrendingUp, Users, Brain, PenTool, Search,
  Zap, Award, Building, Shield, Book, Monitor, GraduationCap, DollarSign,
  CreditCard, Calendar, Key, Package, Coins, FileSignature, MessageSquare,
  Plug, Link: Link2, Link2, Activity, MapPin, Library, Wand2, FileSearch, Code,
  CheckSquare, UserPlus, FileBarChart, BookPlus, FileQuestion, Presentation, Copyright,
  Wallet, Receipt, PieChart, Plane, BookMarked, Palette, Calculator, BookText,
  ClipboardCheck, KeyRound, BarChart2, BookCheck: BookMarked, ClipboardList
};

interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({ isCollapsed: externalCollapsed, onToggleCollapse }: SidebarProps) {
  const { user, roles } = useAuth();
  const { language, t } = useLanguage();
  const location = useLocation();
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

  const toggleExpand = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  const filteredMenu = getFilteredMenu(roles || []);
  const quickActions = getQuickActions(roles || []);

  const renderIcon = (iconName: string, className: string = '') => {
    const Icon = iconMap[iconName];
    return Icon ? <Icon className={className} /> : null;
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const active = isActive(item.path);

    return (
      <div key={item.id} className="mb-1">
        <Link
          to={!hasChildren ? item.path : '#'}
          onClick={(e) => {
            if (hasChildren) {
              e.preventDefault();
              toggleExpand(item.id);
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
          {renderIcon(item.icon, `w-5 h-5 ${active ? 'text-white' : ''}`)}
          
          {!isCollapsed && (
            <>
              <span className="flex-1">{t(item.labelKey)}</span>
              
              {item.badge && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500 text-white">
                  {item.badge}
                </span>
              )}

              {hasChildren && (
                isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
              )}
            </>
          )}
        </Link>

        {hasChildren && isExpanded && !isCollapsed && (
          <div className="mt-1">
            {item.children!.map(child => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const sidebarContent = (
    <>
      {/* Logo & Header */}
      <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} p-4 border-b border-gray-200 dark:border-gray-700`}>
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">Z</span>
            </div>
            <span className="font-bold text-lg">Zerquiz</span>
          </div>
        )}
        
        <button
          onClick={toggleCollapse}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg hidden lg:block"
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Mobile close button */}
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg lg:hidden"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Actions (Always visible) */}
      {!isCollapsed && quickActions.length > 0 && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
            {t('quick_actions') || 'Quick Actions'}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.slice(0, 4).map(action => (
              <Link
                key={action.id}
                to={action.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg ${action.color} bg-opacity-10 hover:bg-opacity-20 transition-colors`}
              >
                {renderIcon(action.icon, 'w-5 h-5')}
                <span className="text-xs text-center">{t(action.labelKey)}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        {!isCollapsed && (
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2 px-2">
            {language === 'tr' ? 'Ana Menü' : 'Main Menu'}
          </h3>
        )}
        {filteredMenu.map(item => renderMenuItem(item))}
      </nav>

      {/* User Profile (Bottom) */}
      {!isCollapsed && user && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name || user.email}</p>
              <p className="text-xs text-gray-500 truncate">
                {user.roles?.join(', ') || 'User'}
              </p>
            </div>
            <Bell className="w-5 h-5 text-gray-500 cursor-pointer hover:text-blue-600" />
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-white dark:bg-gray-900 rounded-lg shadow-lg"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Desktop Sidebar */}
      <aside
        className={`
          hidden lg:flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700
          transition-all duration-300 h-screen sticky top-0
          ${isCollapsed ? 'w-20' : 'w-64'}
        `}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar (Overlay) */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <aside className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-gray-900 z-50 lg:hidden flex flex-col shadow-2xl">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}

export default Sidebar;
