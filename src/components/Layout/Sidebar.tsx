import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Package,
  LayoutDashboard,
  ShoppingCart,
  Bell,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Store,
  Users,
  Gift,
  MapPin,
  Image,
  Settings,
  DollarSign
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [isProductsOpen, setIsProductsOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  type NavigationItem = {
    name: string;
    icon: any;
    href: string;
    children?: { name: string; href: string }[];
  };

  const navigation: NavigationItem[] = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      href: '/dashboard'
    },
    {
      name: 'Category',
      icon: Package,
      href: '/dashboard/categories',
    },
    {
      name: 'Products',
      icon: Package,
      href: '/dashboard/products',
      children: [
        { name: 'All Products', href: '/dashboard/products' },
        { name: 'Deleted Products', href: '/dashboard/deleted-products' }
      ]
    },
    {
      name: 'Orders',
      icon: ShoppingCart,
      href: '/dashboard/orders'
    },
    {
      name: 'Pincodes',
      icon: MapPin,
      href: '/dashboard/pincodes'
    },
    {
      name: 'Hero Images',
      icon: Image,
      href: '/dashboard/hero-images'
    },
    {
      name: 'Users',
      icon: Users,
      href: '/dashboard/users'
    },
    {
      name: 'Referral Codes',
      icon: Gift,
      href: '/dashboard/referral-codes'
    },
    {
      name: 'Notifications',
      icon: Bell,
      href: '/dashboard/notifications'
    },
    {
      name: 'Payouts',
      icon: DollarSign,
      href: '/dashboard/payouts'
    },
    {
      name: 'Platform Settings',
      icon: Settings,
      href: '/dashboard/platform-settings'
    }
  ];

  const isActive = (href: string) => location.pathname === href;

  const isParentActive = (children: any[]) => {
    return children.some(child => location.pathname === child.href);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-screen">
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
        {/* <Store className="h-8 w-8 text-blue-600" /> */}
          {/* <span className="text-xl font-bold text-gray-900 dark:text-white">
            Fashcycle Admin
          </span> */}
          <img 
            src="https://www.fashcycle.com/_next/static/media/HomeLogo.90173f35.png"
            alt="Fashcycle Logo"
            className="h-8 object-contain"
          />
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navigation.map((item) => (
          <div key={item.name}>
            {item.children ? (
              <div>
                <button
                  onClick={() => setIsProductsOpen(!isProductsOpen)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isParentActive(item.children)
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                      : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </div>
                  {isProductsOpen ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
                {isProductsOpen && (
                  <div className="ml-8 mt-2 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        to={child.href}
                        className={`block px-4 py-2 text-sm rounded-md transition-colors ${
                          isActive(child.href)
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                            : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
                        }`}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                to={item.href}
                className={`flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            )}
          </div>
        ))}
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md"
      >
        <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
      </button>

      {/* Mobile sidebar */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="relative flex flex-col w-64 bg-white dark:bg-gray-900 shadow-xl">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
        <SidebarContent />
      </div>
    </>
  );
};

export default Sidebar;
