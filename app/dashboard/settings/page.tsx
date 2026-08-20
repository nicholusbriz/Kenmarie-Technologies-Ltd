'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login');
          return;
        }
        setUser(user);
      } catch (error) {
        console.error('Error fetching user:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    getUser();
  }, [supabase, router]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
        setIsSigningOut(false);
        return;
      }
      
      router.push('/');
      router.refresh();
      
    } catch (error) {
      console.error('Unexpected error during sign out:', error);
      setIsSigningOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-background rounded-lg border border-border shadow-custom p-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-background rounded-lg border border-border shadow-custom p-8">
        <h1 className="text-3xl font-bold text-primary mb-8">Settings</h1>
        
        <div className="space-y-6">
          <div className="bg-background-alt p-6 rounded-lg border border-border">
            <h2 className="text-lg font-semibold text-primary mb-4">Account Settings</h2>
            <p className="text-sm text-text-light mb-4">
              Manage your account preferences and security settings.
            </p>
            <div className="space-y-3">
              <button className="w-full px-4 py-2 text-sm bg-primary hover:bg-primary-light text-text-white rounded-md transition-colors text-left">
                Change Password
              </button>
              <button className="w-full px-4 py-2 text-sm bg-primary hover:bg-primary-light text-text-white rounded-md transition-colors text-left">
                Update Email
              </button>
              <button className="w-full px-4 py-2 text-sm bg-primary hover:bg-primary-light text-text-white rounded-md transition-colors text-left">
                Manage Linked Accounts
              </button>
            </div>
          </div>

          <div className="bg-background-alt p-6 rounded-lg border border-border">
            <h2 className="text-lg font-semibold text-primary mb-4">Preferences</h2>
            <p className="text-sm text-text-light mb-4">
              Customize your dashboard experience.
            </p>
            <div className="space-y-3">
              <button className="w-full px-4 py-2 text-sm bg-primary hover:bg-primary-light text-text-white rounded-md transition-colors text-left">
                Notification Settings
              </button>
              <button className="w-full px-4 py-2 text-sm bg-primary hover:bg-primary-light text-text-white rounded-md transition-colors text-left">
                Theme Settings
              </button>
              <button className="w-full px-4 py-2 text-sm bg-primary hover:bg-primary-light text-text-white rounded-md transition-colors text-left">
                Language Settings
              </button>
            </div>
          </div>

          <div className="bg-background-alt p-6 rounded-lg border border-border">
            <h2 className="text-lg font-semibold text-primary mb-4">Danger Zone</h2>
            <p className="text-sm text-text-light mb-4">
              Irreversible and destructive actions.
            </p>
            <button
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="w-full px-4 py-2 text-sm bg-danger hover:bg-red-600 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSigningOut ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing Out...
                </span>
              ) : (
                'Sign Out'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}