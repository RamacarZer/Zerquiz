import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface Tab {
  key: string;
  label: string;
  icon: LucideIcon;
  requiredPermissions?: string[];
  requiredRoles?: string[];
}

interface ModuleTabLayoutProps {
  title: string;
  description?: string;
  basePath: string;
  tabs: Tab[];
  children: React.ReactNode;
}

export default function ModuleTabLayout({
  title,
  description,
  basePath,
  tabs,
  children,
}: ModuleTabLayoutProps) {
  const location = useLocation();
  const { hasPermission, hasAnyRole } = useAuth();

  // Filter tabs based on permissions and roles
  const visibleTabs = useMemo(() => {
    return tabs.filter((tab) => {
      // Check permissions
      if (tab.requiredPermissions && tab.requiredPermissions.length > 0) {
        const hasAllPermissions = tab.requiredPermissions.every((perm) =>
          hasPermission(perm)
        );
        if (!hasAllPermissions) return false;
      }

      // Check roles
      if (tab.requiredRoles && tab.requiredRoles.length > 0) {
        if (!hasAnyRole(tab.requiredRoles)) return false;
      }

      return true;
    });
  }, [tabs, hasPermission, hasAnyRole]);

  // Determine active tab
  const activeTabKey = useMemo(() => {
    const currentPath = location.pathname;
    const match = tabs.find((tab) =>
      currentPath.startsWith(`${basePath}/${tab.key}`)
    );
    return match?.key || tabs[0]?.key;
  }, [location.pathname, basePath, tabs]);

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {title}
        </h1>
        {description && (
          <p className="text-gray-600 dark:text-gray-400">{description}</p>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="flex flex-wrap border-b border-gray-200 dark:border-gray-700">
          {visibleTabs.map((tab) => {
            const isActive = activeTabKey === tab.key;
            const Icon = tab.icon;

            return (
              <Link
                key={tab.key}
                to={`${basePath}/${tab.key}`}
                className={`
                  flex items-center gap-2 px-6 py-4 font-medium transition-all
                  border-b-2 hover:bg-gray-50 dark:hover:bg-gray-700
                  ${
                    isActive
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-transparent text-gray-600 dark:text-gray-400'
                  }
                `}
              >
                <Icon size={20} />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
