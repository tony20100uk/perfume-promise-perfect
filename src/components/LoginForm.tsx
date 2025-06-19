
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageToggle } from './LanguageToggle';
import { useToast } from '@/hooks/use-toast';

export function LoginForm() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await login({ identifier, password });
    
    if (!success) {
      toast({
        title: t.error,
        description: "Invalid credentials. Try: admin/admin or 1234567890123/client1 or john@email.com/client2",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-4xl">🌸</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Thai Perfume Studio</h1>
          <p className="text-gray-600">Custom Fragrance Management</p>
        </div>

        <Card className="shadow-xl border-amber-200">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl">{t.login}</CardTitle>
              <LanguageToggle />
            </div>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="identifier">{t.idNumber} / {t.email} / {t.phone}</Label>
                <Input
                  id="identifier"
                  type="text"
                  placeholder="1234567890123 / email / phone"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  className="border-amber-200 focus:border-amber-400"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">{t.password}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-amber-200 focus:border-amber-400"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                disabled={isLoading}
              >
                {isLoading ? t.loading : t.login}
              </Button>
            </form>

            <div className="mt-6 text-sm text-gray-600 space-y-1">
              <p className="font-medium">Demo credentials:</p>
              <p>Admin: admin / admin</p>
              <p>Client 1: 1234567890123 / client1</p>
              <p>Client 2: john@email.com / client2</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
