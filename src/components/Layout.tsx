import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageToggle } from './LanguageToggle';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
interface LayoutProps {
  children: React.ReactNode;
}
export function Layout({
  children
}: LayoutProps) {
  const {
    user,
    logout
  } = useAuth();
  const {
    t
  } = useLanguage();
  if (!user) {
    return <>{children}</>;
  }
  return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-amber-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">🌸</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Thai Perfume Studio</h1>
                <p className="text-sm text-gray-600">{t.welcome}, {user.name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <LanguageToggle />
              <Button variant="outline" onClick={logout} size="sm">
                {t.logout}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>;
}