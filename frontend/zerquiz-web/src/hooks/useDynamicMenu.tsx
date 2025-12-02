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
      const response = await fetch(
        `${import.meta.env.VITE_CORE_API_URL || 'http://localhost:5002'}/api/Menu/user-menu?language=${language}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch menu: ${response.statusText}`);
      }

      const data: UserMenuResponse = await response.json();
      setMenuItems(data.items);
    } catch (err) {
      console.error('Error fetching dynamic menu:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      // Fallback to empty menu on error
      setMenuItems([]);
    } finally {
      setLoading(false);
    }
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

