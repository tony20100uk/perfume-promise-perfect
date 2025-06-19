
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setLanguage(language === 'th' ? 'en' : 'th')}
      className="font-medium"
    >
      {language === 'th' ? '🇬🇧 EN' : '🇹🇭 ไทย'}
    </Button>
  );
}
