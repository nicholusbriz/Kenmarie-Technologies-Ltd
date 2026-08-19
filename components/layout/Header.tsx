'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' }, // Added Contact
];

const serviceLinks = [
  { label: 'Web Hosting', href: '/services/web-hosting' },
  { label: 'Cloud Deployment', href: '/services/cloud-deployment' },
  { label: 'Azure Solutions', href: '/services/azure-solutions' },
  { label: 'DevOps Services', href: '/services/devops' },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const supabase = createClient();

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const isServiceActive = () => pathname.startsWith('/services');

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setServicesOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setServicesOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setServicesOpen(false);
    }, 200);
  };

  const handleServiceClick = () => {
    // On desktop, clicking the Services button toggles the dropdown
    if (window.innerWidth >= 768) {
      setServicesOpen(!servicesOpen);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-primary border-b border-primary-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-3" aria-label="Go to home">
            <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
              <Image 
                src="/kenmarie-logo.png" 
                alt="Kenmarie Technologies Logo" 
                width={40} 
                height={40}
                className="object-contain"
              />
            </div>
            <div className="leading-tight">
              <span className="text-text-white font-bold text-lg tracking-tight block">
                Kenmarie
              </span>
              <span className="text-secondary-light text-[10px] font-medium tracking-widest uppercase block -mt-0.5">
                Technologies Ltd
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2" aria-label="Main navigation">
            {navLinks.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className={`
                  relative px-5 py-2.5 text-sm font-medium rounded-md transition-all duration-200
                  ${isActive(href)
                    ? 'text-text-white bg-primary-light'
                    : 'text-text-light hover:text-text-white hover:bg-primary-light'
                  }
                `}
                aria-current={isActive(href) ? 'page' : undefined}
              >
                {label}
                {isActive(href) && (
                  <span className="absolute bottom-0 left-5 right-5 h-0.5 rounded-full bg-secondary" />
                )}
              </Link>
            ))}

            {/* Services Dropdown - Desktop */}
            <div 
              ref={dropdownRef}
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={handleServiceClick}
                className={`
                  relative px-5 py-2.5 text-sm font-medium rounded-md transition-all duration-200 flex items-center gap-1 cursor-pointer
                  ${isServiceActive()
                    ? 'text-text-white bg-primary-light'
                    : 'text-text-light hover:text-text-white hover:bg-primary-light'
                  }
                `}
                aria-expanded={servicesOpen}
              >
                Services
                <svg 
                  className={`w-4 h-4 transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
                {isServiceActive() && (
                  <span className="absolute bottom-0 left-5 right-5 h-0.5 rounded-full bg-secondary" />
                )}
              </button>

              {/* Dropdown Menu */}
              {servicesOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-primary border border-primary-light rounded-lg shadow-custom-lg py-2 animate-fade-in">
                  {serviceLinks.map(({ label, href }) => (
                    <Link
                      key={href}
                      href={href}
                      className={`
                        block px-4 py-2.5 text-sm transition-colors duration-200
                        ${pathname === href
                          ? 'text-text-white bg-primary-light'
                          : 'text-text-light hover:text-text-white hover:bg-primary-light'
                        }
                      `}
                      onClick={() => setServicesOpen(false)}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Auth Button - Show Dashboard if logged in, Login otherwise */}
            {!loading && user ? (
              <Link
                href="/dashboard"
                className="ml-2 px-6 py-2.5 text-sm font-semibold rounded-md bg-secondary hover:bg-secondary-dark text-white transition-all duration-200 hover:shadow-custom"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="ml-2 px-6 py-2.5 text-sm font-semibold rounded-md bg-secondary hover:bg-secondary-dark text-white transition-all duration-200 hover:shadow-custom"
              >
                Login
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-md text-text-light hover:text-text-white hover:bg-primary-light transition-colors duration-200"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle mobile menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-primary-light bg-primary">
          <nav className="px-4 py-4 flex flex-col gap-1" aria-label="Mobile navigation">
            {navLinks.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`
                  w-full px-4 py-3 text-sm font-medium rounded-md transition-colors duration-200
                  ${isActive(href)
                    ? 'text-text-white bg-primary-light border-l-2 border-secondary'
                    : 'text-text-light hover:text-text-white hover:bg-primary-light'
                  }
                `}
                aria-current={isActive(href) ? 'page' : undefined}
              >
                {label}
              </Link>
            ))}
            
            {/* Mobile Services Section */}
            <div className="mt-1">
              <button
                onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                className={`
                  w-full px-4 py-3 text-sm font-medium rounded-md transition-colors duration-200 flex items-center justify-between
                  ${isServiceActive()
                    ? 'text-text-white bg-primary-light border-l-2 border-secondary'
                    : 'text-text-light hover:text-text-white hover:bg-primary-light'
                  }
                `}
              >
                Services
                <svg 
                  className={`w-4 h-4 transition-transform duration-200 ${mobileServicesOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {mobileServicesOpen && (
                <div className="ml-4 mt-1 flex flex-col gap-1 border-l-2 border-primary-light pl-3">
                  {serviceLinks.map(({ label, href }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => {
                        setMobileOpen(false);
                        setMobileServicesOpen(false);
                      }}
                      className={`
                        px-4 py-2.5 text-sm rounded-md transition-colors duration-200
                        ${pathname === href
                          ? 'text-text-white bg-primary-light'
                          : 'text-text-light hover:text-text-white hover:bg-primary-light'
                        }
                      `}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Auth Button - Show Dashboard if logged in, Login otherwise */}
            {!loading && user ? (
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="mt-3 w-full px-4 py-3 text-sm font-semibold rounded-md bg-secondary hover:bg-secondary-dark text-white text-center transition-all duration-200"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="mt-3 w-full px-4 py-3 text-sm font-semibold rounded-md bg-secondary hover:bg-secondary-dark text-white text-center transition-all duration-200"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}