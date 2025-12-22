import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useLanguage } from './useLanguage';

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

interface UserMenuResponse {
  items: MenuItem[];
  totalCount: number;
  language: string;
}

export function useDynamicMenu() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserMenu();
    }
  }, [user, language]);

  const fetchUserMenu = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_CORE_API_URL || 'http://localhost:5002';
      const fullUrl = `${apiUrl}/api/Menu/user-menu?language=${language}`;
      
      console.log('🔍 Fetching menu from:', fullUrl);
      console.log('🔑 Token:', token ? 'Present' : 'Missing');
      
      const response = await fetch(fullUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 Menu API Response Status:', response.status);

      if (!response.ok) {
        console.warn('⚠️ Menu API failed with status:', response.status);
        console.warn('Using fallback menu instead');
        setMenuItems(getFallbackMenu(language));
        setLoading(false);
        return;
      }

      const data: UserMenuResponse = await response.json();
      console.log('✅ Menu data received:', data);
      console.log('📋 Menu items count:', data.items?.length || 0);
      
      const items = data.items || data.Items || getFallbackMenu(language);
      console.log('🎯 Setting menu items:', items);
      setMenuItems(items);
    } catch (err) {
      console.error('❌ Error fetching dynamic menu:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      // Use fallback menu on error
      console.log('🔄 Using fallback menu due to error');
      setMenuItems(getFallbackMenu(language));
    } finally {
      setLoading(false);
    }
  };

  // Fallback menu for when backend is not ready
  const getFallbackMenu = (lang: string): MenuItem[] => {
    const isTurkish = lang === 'tr';
    return [
      {
        menu_id: '1',
        menu_code: 'DASHBOARD',
        parent_menu_id: undefined,
        label: 'Dashboard',
        icon_name: 'LayoutDashboard',
        path: '/dashboard',
        display_order: 1,
        level: 0,
        menu_type: 'link',
        has_children: false,
        module_code: 'DASHBOARD',
        children: []
      },
      {
        menu_id: '2',
        menu_code: 'CONTENT',
        parent_menu_id: undefined,
        label: isTurkish ? 'İçerik Kütüphanesi' : 'Content Library',
        icon_name: 'BookOpen',
        path: '/content-library',
        display_order: 2,
        level: 0,
        menu_type: 'link',
        has_children: false,
        module_code: 'CONTENT',
        children: []
      },
      {
        menu_id: '3',
        menu_code: 'QUESTIONS',
        parent_menu_id: undefined,
        label: isTurkish ? 'Soru Bankası' : 'Questions',
        icon_name: 'HelpCircle',
        path: '/questions',
        display_order: 3,
        level: 0,
        menu_type: 'link',
        has_children: false,
        module_code: 'QUESTIONS',
        children: []
      },
      {
        menu_id: '4',
        menu_code: 'EXAMS',
        parent_menu_id: undefined,
        label: isTurkish ? 'Sınavlar' : 'Exams',
        icon_name: 'FileText',
        path: '/exams',
        display_order: 4,
        level: 0,
        menu_type: 'link',
        has_children: false,
        module_code: 'EXAMS',
        children: []
      },
      {
        menu_id: '5',
        menu_code: 'CURRICULUM',
        parent_menu_id: undefined,
        label: isTurkish ? 'Müfredat' : 'Curriculum',
        icon_name: 'BookMarked',
        path: '/curriculum',
        display_order: 5,
        level: 0,
        menu_type: 'link',
        has_children: false,
        module_code: 'CURRICULUM',
        children: []
      },
      {
        menu_id: '6',
        menu_code: 'LESSONS',
        parent_menu_id: undefined,
        label: isTurkish ? 'Ders Planları' : 'Lesson Plans',
        icon_name: 'Calendar',
        path: '/lessons',
        display_order: 6,
        level: 0,
        menu_type: 'link',
        has_children: false,
        module_code: 'LESSONS',
        children: []
      },
      {
        menu_id: '7',
        menu_code: 'GRADING',
        parent_menu_id: undefined,
        label: isTurkish ? 'Değerlendirme' : 'Grading',
        icon_name: 'Award',
        path: '/grading',
        display_order: 7,
        level: 0,
        menu_type: 'link',
        has_children: false,
        module_code: 'GRADING',
        children: []
      },
      {
        menu_id: '8',
        menu_code: 'USERS',
        parent_menu_id: undefined,
        label: isTurkish ? 'Kullanıcılar' : 'Users',
        icon_name: 'Users',
        path: '/users',
        display_order: 8,
        level: 0,
        menu_type: 'link',
        has_children: false,
        module_code: 'IDENTITY',
        children: []
      },
      {
        menu_id: '9',
        menu_code: 'SETTINGS',
        parent_menu_id: undefined,
        label: isTurkish ? 'Ayarlar' : 'Settings',
        icon_name: 'Settings',
        path: '/settings',
        display_order: 9,
        level: 0,
        menu_type: 'link',
        has_children: false,
        module_code: 'CORE',
        children: []
      }
    ];
  };

  const canAccessModule = async (moduleCode: string): Promise<boolean> => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${import.meta.env.VITE_CORE_API_URL || 'http://localhost:5002'}/api/Menu/can-access-module/${moduleCode}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      return data.canAccess;
    } catch (err) {
      console.error('Error checking module access:', err);
      return false;
    }
  };

  const findMenuByPath = (path: string): MenuItem | undefined => {
    const findInTree = (items: MenuItem[]): MenuItem | undefined => {
      for (const item of items) {
        if (item.path === path) {
          return item;
        }
        if (item.children && item.children.length > 0) {
          const found = findInTree(item.children);
          if (found) return found;
        }
      }
      return undefined;
    };

    return findInTree(menuItems);
  };

  const getMenuByLevel = (level: number): MenuItem[] => {
    const getAllItems = (items: MenuItem[]): MenuItem[] => {
      let result: MenuItem[] = [];
      for (const item of items) {
        if (item.level === level) {
          result.push(item);
        }
        if (item.children && item.children.length > 0) {
          result = result.concat(getAllItems(item.children));
        }
      }
      return result;
    };

    return getAllItems(menuItems);
  };

  const getRootMenuItems = (): MenuItem[] => {
    return menuItems.filter(item => item.level === 0);
  };

  const refresh = () => {
    fetchUserMenu();
  };

  return {
    menuItems,
    loading,
    error,
    canAccessModule,
    findMenuByPath,
    getMenuByLevel,
    getRootMenuItems,
    refresh,
  };
}

