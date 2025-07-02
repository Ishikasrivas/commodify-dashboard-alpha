import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, User, Shield, Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const RoleSelection: React.FC = () => {
  const { t } = useTranslation();
  const [selectedRole, setSelectedRole] = useState<'manager' | 'storekeeper' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { updateUserRole, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleRoleSelection = async () => {
    if (!selectedRole || !user) return;

    setIsLoading(true);
    setError('');

    try {
      const { error } = await updateUserRole(selectedRole);
      if (error) {
        setError(error.message || 'Failed to update role.');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">{t('roleSelection.loading')}</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto mb-6 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <User className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t('roleSelection.selectRole')}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                selectedRole === 'manager'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
              onClick={() => setSelectedRole('manager')}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2 rounded-full ${
                    selectedRole === 'manager'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{t('roleSelection.manager')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('roleSelection.managerDescription')}
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                selectedRole === 'storekeeper'
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
              onClick={() => setSelectedRole('storekeeper')}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2 rounded-full ${
                    selectedRole === 'storekeeper'
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  <Package className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{t('roleSelection.storekeeper')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('roleSelection.storekeeperDescription')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="border-red-200 bg-red-50 dark:bg-red-900/20">
              <AlertDescription className="text-red-800 dark:text-red-200">{error}</AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleRoleSelection}
            className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
            disabled={!selectedRole || isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('roleSelection.continueAs')} {selectedRole === 'manager' ? t('roleSelection.manager') : t('roleSelection.storekeeper')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleSelection;
