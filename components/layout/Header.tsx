'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
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

  /* =========================================
     AUTHENTICATION
  ========================================= */

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        setUser(user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  /* =========================================
     ACTIVE NAVIGATION
  ========================================= */

  const isActive = (href: string) =>
    href === '/'
      ? pathname === '/'
      : pathname.startsWith(href);

  const isServiceActive = () =>
    pathname.startsWith('/services');

  /* =========================================
     CLOSE DROPDOWN WHEN CLICKING OUTSIDE
  ========================================= */

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setServicesOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () =>
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );
  }, []);

  /* =========================================
     SERVICES DROPDOWN
  ========================================= */

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
    if (window.innerWidth >= 768) {
      setServicesOpen(!servicesOpen);
    }
  };

  /* =========================================
     CLOSE MOBILE MENU
  ========================================= */

  const closeMobileMenu = () => {
    setMobileOpen(false);
    setMobileServicesOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-primary/95 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* =====================================
            MAIN HEADER
        ===================================== */}

        <div className="flex h-16 items-center justify-between md:h-20">

          {/* ===================================
              LOGO
          =================================== */}

          <Link
            href="/"
            className="flex shrink-0 items-center gap-3"
            aria-label="Go to home"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center">
              <Image
                src="/kenmarie-logo.png"
                alt="Kenmarie Technologies Logo"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>

            <div className="leading-tight">
              <span className="block text-lg font-bold tracking-tight text-white">
                Kenmarie
              </span>

              <span className="block -mt-0.5 text-[10px] font-medium uppercase tracking-widest text-secondary-light">
                Technologies Ltd
              </span>
            </div>
          </Link>

          {/* ===================================
              DESKTOP NAVIGATION
          =================================== */}

          <nav
            className="hidden items-center gap-2 md:flex"
            aria-label="Main navigation"
          >
            {/* Main Links */}

            {navLinks.map(({ label, href }) => {
              const active = isActive(href);

              return (
                <Link
                  key={href}
                  href={href}
                  className={`
                    relative
                    rounded-lg
                    px-5
                    py-2.5
                    text-sm
                    font-medium
                    text-white
                    transition-all
                    duration-300

                    ${
                      active
                        ? 'bg-white/10'
                        : 'hover:bg-white/10'
                    }
                  `}
                  aria-current={active ? 'page' : undefined}
                >
                  {label}

                  {/* Active Indicator */}

                  {active && (
                    <span
                      className="
                        absolute
                        bottom-0
                        left-5
                        right-5
                        h-0.5
                        rounded-full
                        bg-gradient-to-r from-secondary to-accent
                      "
                    />
                  )}
                </Link>
              );
            })}

            {/* =================================
                SERVICES DROPDOWN
            ================================= */}

            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={handleServiceClick}
                className={`
                  relative
                  flex
                  cursor-pointer
                  items-center
                  gap-1
                  rounded-lg
                  px-5
                  py-2.5
                  text-sm
                  font-medium
                  text-white
                  transition-all
                  duration-300

                  ${
                    isServiceActive()
                      ? 'bg-white/10'
                      : 'hover:bg-white/10'
                  }
                `}
                aria-expanded={servicesOpen}
              >
                Services

                <svg
                  className={`
                    h-4
                    w-4
                    transition-transform
                    duration-300
                    ${
                      servicesOpen
                        ? 'rotate-180'
                        : ''
                    }
                  `}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>

                {/* Active Indicator */}

                {isServiceActive() && (
                  <span
                    className="
                      absolute
                      bottom-0
                      left-5
                      right-5
                      h-0.5
                      rounded-full
                      bg-gradient-to-r from-secondary to-accent
                    "
                  />
                )}
              </button>

              {/* =================================
                  DROPDOWN
              ================================= */}

              {servicesOpen && (
                <div
                  className="
                    absolute
                    left-0
                    top-full
                    mt-2
                    w-56
                    overflow-hidden
                    rounded-xl
                    border
                    border-white/10
                    bg-primary/95
                    backdrop-blur-xl
                    py-2
                    shadow-custom-lg
                    animate-fade-in
                  "
                >
                  {serviceLinks.map(({ label, href }) => {
                    const active = pathname === href;

                    return (
                      <Link
                        key={href}
                        href={href}
                        onClick={() =>
                          setServicesOpen(false)
                        }
                        className={`
                          block
                          px-4
                          py-2.5
                          text-sm
                          font-medium
                          text-white
                          transition-all
                          duration-300

                          ${
                            active
                              ? 'bg-white/10'
                              : 'hover:bg-white/10'
                          }
                        `}
                      >
                        {label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* =================================
                AUTH BUTTON
            ================================= */}

            {!loading && user ? (
              <Link
                href="/dashboard"
                className="
                  ml-2
                  rounded-lg
                  bg-gradient-to-r from-secondary to-accent
                  px-6
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  transition-all
                  duration-300
                  hover:shadow-glow
                  hover-lift
                "
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="
                  ml-2
                  rounded-lg
                  bg-gradient-to-r from-secondary to-accent
                  px-6
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  transition-all
                  duration-300
                  hover:shadow-glow
                  hover-lift
                "
              >
                Login
              </Link>
            )}
          </nav>

          {/* ===================================
              MOBILE MENU BUTTON
          =================================== */}

          <button
            type="button"
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-md
              text-white
              transition-all
              duration-200
              hover:bg-primary-light
              md:hidden
            "
            onClick={() =>
              setMobileOpen(!mobileOpen)
            }
            aria-label="Toggle mobile menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ========================================
          MOBILE MENU
      ======================================== */}

      {mobileOpen && (
        <div
          className="
            border-t
            border-white/10
            bg-primary/95
            backdrop-blur-xl
            md:hidden
            animate-fade-in
          "
        >
          <nav
            className="
              flex
              flex-col
              gap-1
              px-4
              py-4
            "
            aria-label="Mobile navigation"
          >
            {/* Main Links */}

            {navLinks.map(({ label, href }) => {
              const active = isActive(href);

              return (
                <Link
                  key={href}
                  href={href}
                  onClick={closeMobileMenu}
                  className={`
                    w-full
                    rounded-lg
                    px-4
                    py-3
                    text-sm
                    font-medium
                    text-white
                    transition-all
                    duration-300

                    ${
                      active
                        ? `
                          bg-white/10
                        `
                        : `
                          hover:bg-white/10
                        `
                    }
                  `}
                  aria-current={
                    active ? 'page' : undefined
                  }
                >
                  {label}
                </Link>
              );
            })}

            {/* =================================
                MOBILE SERVICES
            ================================= */}

            <div className="mt-1">
              <button
                type="button"
                onClick={() =>
                  setMobileServicesOpen(
                    !mobileServicesOpen
                  )
                }
                className={`
                  flex
                  w-full
                  items-center
                  justify-between
                  rounded-lg
                  px-4
                  py-3
                  text-sm
                  font-medium
                  text-white
                  transition-all
                  duration-300

                  ${
                    isServiceActive()
                      ? `
                        bg-white/10
                      `
                      : `
                        hover:bg-white/10
                      `
                  }
                `}
              >
                <span>Services</span>

                <svg
                  className={`
                    h-4
                    w-4
                    transition-transform
                    duration-300

                    ${
                      mobileServicesOpen
                        ? 'rotate-180'
                        : ''
                    }
                  `}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Mobile Service Links */}

              {mobileServicesOpen && (
                <div
                  className="
                    ml-4
                    mt-1
                    flex
                    flex-col
                    gap-1
                    border-l-2
                    border-primary-light
                    pl-3
                  "
                >
                  {serviceLinks.map(
                    ({ label, href }) => {
                      const active =
                        pathname === href;

                      return (
                        <Link
                          key={href}
                          href={href}
                          onClick={
                            closeMobileMenu
                          }
                          className={`
                            rounded-md
                            px-4
                            py-2.5
                            text-sm
                            font-medium
                            text-white
                            transition-all
                            duration-200

                            ${
                              active
                                ? 'bg-primary-light'
                                : 'hover:bg-primary-light'
                            }
                          `}
                        >
                          {label}
                        </Link>
                      );
                    }
                  )}
                </div>
              )}
            </div>

            {/* =================================
                MOBILE AUTH
            ================================= */}

            {!loading && user ? (
              <Link
                href="/dashboard"
                onClick={closeMobileMenu}
                className="
                  mt-3
                  w-full
                  rounded-lg
                  bg-gradient-to-r from-secondary to-accent
                  px-4
                  py-3
                  text-center
                  text-sm
                  font-semibold
                  text-white
                  transition-all
                  duration-300
                  hover:shadow-glow
                "
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={closeMobileMenu}
                className="
                  mt-3
                  w-full
                  rounded-lg
                  bg-gradient-to-r from-secondary to-accent
                  px-4
                  py-3
                  text-center
                  text-sm
                  font-semibold
                  text-white
                  transition-all
                  duration-300
                  hover:shadow-glow
                "
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