'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Auth check error:', error);
      }
    };

    checkAuth();
  }, [supabase, router]);

  const handleGitHubLogin = async () => {
    setIsLoading(true);
    
    try {
      // Use environment variable for redirect URL with fallback
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
      const redirectTo = `${baseUrl}/api/auth/callback`;
      
      console.log('Redirect URL:', redirectTo); // For debugging

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: redirectTo,
        },
      });

      if (error) {
        console.error('GitHub login error:', error);
        setIsLoading(false);
        // Optionally show error to user
      }
      // If successful, Supabase handles the redirect
    } catch (error) {
      console.error('Unexpected error:', error);
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background-alt py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        {/* Logo & Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-secondary rounded-xl flex items-center justify-center transform transition-transform duration-300 hover:scale-110 active:scale-95">
              <span className="text-text-white font-bold text-2xl">K</span>
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-primary">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-text-light">
            Sign in to your Kenmarie Technologies account
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-background rounded-lg border border-border shadow-custom-lg p-8 transform transition-all duration-300 hover:shadow-custom-xl">
          {/* GitHub Login Button */}
          <button
            onClick={handleGitHubLogin}
            disabled={isLoading}
            className={`
              w-full flex items-center justify-center gap-3 px-4 py-3.5 
              bg-primary hover:bg-primary-dark 
              text-text-white font-medium rounded-md 
              transition-all duration-300 
              hover:shadow-custom hover:scale-[1.02] active:scale-[0.98]
              focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2
              ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}
            `}
          >
            {isLoading ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Redirecting...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.15 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.62.24 2.85.12 3.15.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span>Sign in with GitHub</span>
              </>
            )}
          </button>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-text-light animate-pulse">
                  Secure authentication
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <div className="flex items-center justify-center gap-2 text-xs text-text-light transition-all duration-300 hover:text-secondary hover:scale-105">
              <svg className="w-4 h-4 transition-transform duration-300 hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Secured by GitHub OAuth</span>
            </div>
          </div>
        </div>

        <div className="text-center text-sm space-y-4">
          <p className="text-text-light">
            By signing in, you agree to our{' '}
            <Link href="#" className="text-secondary hover:text-secondary-dark transition-all duration-300 hover:underline underline-offset-2">
              Terms of Service
            </Link>
            {' '}and{' '}
            <Link href="#" className="text-secondary hover:text-secondary-dark transition-all duration-300 hover:underline underline-offset-2">
              Privacy Policy
            </Link>
          </p>
          <p className="text-text-light">
            Don't have an account?{' '}
            <Link href="/contact" className="text-secondary hover:text-secondary-dark transition-all duration-300 font-medium hover:underline underline-offset-2">
              Contact us
            </Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>
    </main>
  );
}