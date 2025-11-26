import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  subItems?: MenuItem[];
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: '📊',
    path: '/dashboard',
  },
  {
    id: 'tenants',
    label: 'Tenant Yönetimi',
    icon: '🏢',
    path: '/tenants',
  },
  {
    id: 'licenses',
    label: 'Lisans Paketleri',
    icon: '🎫',
    path: '/licenses',
  },
  {
    id: 'users',
    label: 'Kullanıcılar',
    icon: '👥',
    path: '/users',
    subItems: [
      { id: 'users-list', label: 'Kullanıcı Listesi', icon: '📋', path: '/users' },
      { id: 'users-roles', label: 'Roller', icon: '🎭', path: '/users/roles' },
      { id: 'users-permissions', label: 'Yetkiler', icon: '🔐', path: '/users/permissions' },
    ],
  },
  {
    id: 'curriculum',
    label: 'Müfredat',
    icon: '📚',
    path: '/curriculum',
    subItems: [
      { id: 'definitions', label: 'Müfredat Yönetimi', icon: '🎯', path: '/curriculum' },
      { id: 'education-models', label: 'Eğitim Modelleri', icon: '🎓', path: '/curriculum/education-models' },
    ],
  },
  {
    id: 'questions',
    label: 'Soru Bankası',
    icon: '❓',
    path: '/questions',
  },
  {
    id: 'presentations',
    label: 'Sunumlar',
    icon: '🎤',
    path: '/presentations',
  },
  {
    id: 'exams',
    label: 'Sınavlar',
    icon: '📄',
    path: '/exams',
  },
  {
    id: 'reports',
    label: 'Raporlar',
    icon: '📈',
    path: '/reports',
  },
  {
    id: 'settings',
    label: 'Ayarlar',
    icon: '⚙️',
    path: '/settings',
  },
];

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const toggleSubmenu = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const isActive = (path: string) => location.pathname === path;
  const isParentActive = (item: MenuItem) => {
    if (item.subItems) {
      return item.subItems.some(sub => location.pathname === sub.path);
    }
    return false;
  };

  const handleLogout = () => {
    // Clear auth token
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside 
        className={`bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white transition-all duration-300 flex flex-col ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          {sidebarOpen ? (
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-xl font-bold">
                Z
              </div>
              <div>
                <div className="font-bold text-lg">Zerquiz</div>
                <div className="text-xs text-gray-400">SuperAdmin</div>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-xl font-bold mx-auto">
              Z
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          {MENU_ITEMS.map((item) => (
            <div key={item.id}>
              {/* Main Menu Item */}
              <div>
                {item.subItems ? (
                  <button
                    onClick={() => toggleSubmenu(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                      isParentActive(item)
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-gray-700 text-gray-300'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    {sidebarOpen && (
                      <>
                        <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
                        <span className={`transition-transform ${expandedMenus.includes(item.id) ? 'rotate-90' : ''}`}>
                          ▶
                        </span>
                      </>
                    )}
                  </button>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                      isActive(item.path)
                        ? 'bg-blue-600 text-white border-l-4 border-blue-400'
                        : 'hover:bg-gray-700 text-gray-300'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                  </Link>
                )}
              </div>

              {/* Submenu Items */}
              {item.subItems && sidebarOpen && expandedMenus.includes(item.id) && (
                <div className="bg-gray-800">
                  {item.subItems.map((subItem) => (
                    <Link
                      key={subItem.id}
                      to={subItem.path}
                      className={`flex items-center gap-3 px-4 py-2 pl-12 text-sm transition-colors ${
                        isActive(subItem.path)
                          ? 'bg-blue-700 text-white'
                          : 'hover:bg-gray-700 text-gray-400'
                      }`}
                    >
                      <span>{subItem.icon}</span>
                      <span>{subItem.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Sidebar Toggle */}
        <div className="border-t border-gray-700 p-4">
          <button
            onClick={toggleSidebar}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            <span className="text-xl">{sidebarOpen ? '◀' : '▶'}</span>
            {sidebarOpen && <span className="text-sm">Menüyü Gizle</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm">
              <Link to="/" className="text-gray-500 hover:text-gray-700">
                Ana Sayfa
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium">
                {MENU_ITEMS.find(item => 
                  item.path === location.pathname || 
                  item.subItems?.some(sub => sub.path === location.pathname)
                )?.label || 'Dashboard'}
              </span>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ara..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  🔍
                </span>
              </div>

              {/* Notifications */}
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <span className="text-xl">🔔</span>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    SA
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-gray-900">Super Admin</div>
                    <div className="text-xs text-gray-500">admin@zerquiz.com</div>
                  </div>
                  <span className="text-gray-400">▼</span>
                </button>

                {/* Dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <span>👤</span>
                      <span>Profil</span>
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <span>⚙️</span>
                      <span>Ayarlar</span>
                    </Link>
                    <hr className="my-2" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <span>🚪</span>
                      <span>Çıkış Yap</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>
              © 2025 Zerquiz. Tüm hakları saklıdır.
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-gray-900">Yardım</a>
              <a href="#" className="hover:text-gray-900">Destek</a>
              <a href="#" className="hover:text-gray-900">v1.0.0</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

