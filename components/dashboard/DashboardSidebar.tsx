'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  FolderKanban,
  Plus,
  Rocket,
  User,
  Settings,
  ArrowLeft,
  X,
  Menu,
  ChevronRight,
} from 'lucide-react';

const navLinks = [
  {
    label: 'Overview',
    href: '/dashboard',
    icon: LayoutDashboard,
    section: 'main',
  },
  {
    label: 'Projects',
    href: '/dashboard/projects',
    icon: FolderKanban,
    section: 'deploy',
  },
  {
    label: 'New Project',
    href: '/dashboard/projects/new',
    icon: Plus,
    section: 'deploy',
  },
  {
    label: 'Deploy',
    href: '/dashboard/deploy',
    icon: Rocket,
    section: 'deploy',
  },
  {
    label: 'Profile',
    href: '/dashboard/profile',
    icon: User,
    section: 'account',
  },
  {
    label: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    section: 'account',
  },
];

export default function DashboardSidebar() {
  const pathname = usePathnameSafe();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    // Overview should only be active on /dashboard
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }

    return pathname === href || pathname.startsWith(href + '/');
  };

  const mainLinks = navLinks.filter(
    (link) => link.section === 'main'
  );

  const deployLinks = navLinks.filter(
    (link) => link.section === 'deploy'
  );

  const accountLinks = navLinks.filter(
    (link) => link.section === 'account'
  );

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  return (
    <>
      {/* ========================================
          MOBILE MENU BUTTON
      ======================================== */}
      <button
        type="button"
        onClick={() => setMobileOpen((prev) => !prev)}
        aria-label={
          mobileOpen
            ? 'Close navigation'
            : 'Open navigation'
        }
        aria-expanded={mobileOpen}
        className="
          fixed
          right-4
          top-4
          z-[60]
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-xl
          border
          border-primary-light
          bg-primary
          text-white
          shadow-lg
          transition-all
          duration-200
          hover:bg-primary-light
          active:scale-95
          lg:hidden
        "
      >
        {mobileOpen ? (
          <X className="h-5 w-5" strokeWidth={2} />
        ) : (
          <Menu className="h-5 w-5" strokeWidth={2} />
        )}
      </button>

      {/* ========================================
          MOBILE OVERLAY
      ======================================== */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={closeMobileMenu}
          className="
            fixed
            inset-0
            z-40
            bg-black/50
            backdrop-blur-[2px]
            lg:hidden
          "
        />
      )}

      {/* ========================================
          SIDEBAR
      ======================================== */}
      <aside
        className={`
          fixed
          inset-y-0
          left-0
          z-50
          flex
          w-64
          flex-col
          border-r
          border-primary-light
          bg-primary
          transition-transform
          duration-300
          ease-in-out

          ${
            mobileOpen
              ? 'translate-x-0'
              : '-translate-x-full lg:translate-x-0'
          }
        `}
      >
        {/* ========================================
            BRAND
        ======================================== */}
        <div
          className="
            flex
            h-[76px]
            shrink-0
            items-center
            border-b
            border-primary-light
            px-5
          "
        >
          <Link
            href="/dashboard"
            onClick={closeMobileMenu}
            className="group flex items-center gap-3"
          >
            {/* Logo / Brand Mark */}
            <img
              src="/kenmarie-logo.png"
              alt="Kenmarie Technologies"
              className="
                h-10
                w-10
                shrink-0
                rounded-xl
                object-contain
                transition-transform
                duration-200
                group-hover:scale-105
              "
            />

            {/* Company Name */}
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                Kenmarie
              </p>

              <p className="truncate text-xs text-sidebar-muted">
                Technologies
              </p>
            </div>
          </Link>
        </div>

        {/* ========================================
            NAVIGATION
        ======================================== */}
        <nav className="sidebar-scroll flex-1 overflow-y-auto px-3 py-5">

          {/* MAIN */}
          <NavSection
            title="Main"
            links={mainLinks}
            isActive={isActive}
            onNavigate={closeMobileMenu}
          />

          {/* PROJECTS */}
          <NavSection
            title="Projects & Deployment"
            links={deployLinks}
            isActive={isActive}
            onNavigate={closeMobileMenu}
            className="mt-7"
          />

          {/* ACCOUNT */}
          <NavSection
            title="Account"
            links={accountLinks}
            isActive={isActive}
            onNavigate={closeMobileMenu}
            className="mt-7"
          />
        </nav>

        {/* ========================================
            BACK TO WEBSITE
        ======================================== */}
        <div
          className="
            shrink-0
            border-t
            border-primary-light
            p-3
          "
        >
          <Link
            href="/"
            onClick={closeMobileMenu}
            className="
              group
              flex
              items-center
              gap-3
              rounded-xl
              border
              border-primary-light
              px-3
              py-3
              text-sm
              text-white
              transition-all
              duration-200
              hover:border-secondary
              hover:bg-primary-light
            "
          >
            {/* Arrow Box */}
            <span
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-lg
                bg-primary-light
                text-white
                transition-all
                duration-200
                group-hover:bg-secondary
              "
            >
              <ArrowLeft
                className="
                  h-4
                  w-4
                  transition-transform
                  duration-200
                  group-hover:-translate-x-0.5
                "
              />
            </span>

            <span className="flex-1 font-medium">
              Back to website
            </span>

            <ChevronRight
              className="
                h-4
                w-4
                text-white/50
                transition-all
                duration-200
                group-hover:translate-x-0.5
                group-hover:text-white
              "
            />
          </Link>
        </div>
      </aside>

      {/* ========================================
          DESKTOP SIDEBAR SPACE
      ======================================== */}
      <div className="hidden w-64 shrink-0 lg:block" />
    </>
  );
}


/* =====================================================
   NAVIGATION SECTION
===================================================== */

function NavSection({
  title,
  links,
  isActive,
  onNavigate,
  className = '',
}: {
  title: string;
  links: typeof navLinks;
  isActive: (href: string) => boolean;
  onNavigate: () => void;
  className?: string;
}) {
  return (
    <div className={className}>
      {/* Section Title */}
      <div className="mb-2 px-3">
        <h3
          className="
            text-[10px]
            font-semibold
            uppercase
            tracking-[0.14em]
            text-sidebar-heading
          "
        >
          {title}
        </h3>
      </div>

      {/* Links */}
      <div className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className={`
                group
                relative
                flex
                items-center
                gap-3
                rounded-xl
                px-3
                py-2.5
                text-sm
                transition-all
                duration-200

                ${
                  active
                    ? `
                      bg-secondary
                      font-medium
                      text-white
                      shadow-sm
                    `
                    : `
                      text-white
                      hover:bg-primary-light
                      hover:text-white
                    `
                }
              `}
            >
              {/* Active Indicator */}
              {active && (
                <span
                  className="
                    absolute
                    left-0
                    top-1/2
                    h-6
                    w-0.5
                    -translate-y-1/2
                    rounded-r-full
                    bg-white
                  "
                />
              )}

              {/* Icon */}
              <span
                className={`
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  transition-all
                  duration-200

                  ${
                    active
                      ? 'bg-white/10'
                      : 'bg-transparent group-hover:bg-white/5'
                  }
                `}
              >
                <Icon
                  className={`
                    h-[18px]
                    w-[18px]
                    transition-all
                    duration-200

                    ${
                      active
                        ? 'text-white'
                        : 'text-white/80 group-hover:text-white'
                    }
                  `}
                  strokeWidth={active ? 2.2 : 1.8}
                />
              </span>

              {/* Link Text */}
              <span className="flex-1 truncate">
                {link.label}
              </span>

              {/* Active Arrow */}
              {active && (
                <ChevronRight
                  className="
                    h-4
                    w-4
                    text-white/50
                  "
                />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}


/* =====================================================
   SAFE PATHNAME HOOK
===================================================== */

import { usePathname } from 'next/navigation';

function usePathnameSafe() {
  return usePathname();
}