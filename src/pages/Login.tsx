import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Lock, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Login: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [success, setSuccess] = useState('');

  const { login, loginWithGoogle, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isSignup) {
        const { error } = await signup(email, password, name);
        if (error) {
          setError(error.message || 'Signup failed.');
        } else {
          setSuccess(t('login.accountCreatedSuccess'));
          setIsSignup(false);
          setEmail('');
          setPassword('');
          setName('');
        }
      } else {
        const { error } = await login(email, password);
        if (error) {
          setError(error.message || 'Login failed.');
        } else {
          await navigate('/role-selection');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      const { error } = await loginWithGoogle();
      if (error) {
        setError(error.message || 'Google login failed.');
      } else {
        await navigate('/role-selection');
      }
    } catch (err) {
      setError('An unexpected error occurred during Google login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto mb-6 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t('login.title')}
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            {isSignup ? t('login.createAccount') : t('login.welcome')}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">{t('login.fullName')}</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('login.enterFullName')}
                  required
                  disabled={isLoading}
                  className="h-11"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">{t('login.email')}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('login.enterEmail')}
                required
                disabled={isLoading}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">{t('login.password')}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('login.enterPassword')}
                required
                disabled={isLoading}
                minLength={6}
                className="h-11"
              />
            </div>

            {error && (
              <Alert variant="destructive" className="border-red-200 bg-red-50 dark:bg-red-900/20">
                <AlertDescription className="text-red-800 dark:text-red-200">{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                <AlertDescription className="text-green-800 dark:text-green-200">{success}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSignup ? t('login.createAccountBtn') : t('login.signIn')}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200 dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-gray-900 px-2 text-muted-foreground">{t('login.orContinueWith')}</span>
            </div>
          </div>

          <Button
            onClick={handleGoogleLogin}
            variant="outline"
            className="w-full h-11 border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 transition-all duration-200"
            disabled={isLoading}
          >
            <Mail className="mr-2 h-4 w-4" />
            {t('login.continueWithGoogle')}
          </Button>

          <div className="text-center">
            <Button
              variant="link"
              onClick={() => {
                setIsSignup(!isSignup);
                setError('');
                setSuccess('');
              }}
              disabled={isLoading}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {isSignup
                ? t('login.alreadyHaveAccount')
                : t('login.dontHaveAccount')
              }
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
