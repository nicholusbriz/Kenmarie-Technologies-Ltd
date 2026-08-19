'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  // Main Dashboard
  { label: 'Dashboard', href: '/dashboard', icon: '📊', section: 'main' },
  
  // Projects & Deployment
  { label: 'Projects', href: '/dashboard/projects', icon: '📁', section: 'deploy' },
  { label: 'New Project', href: '/dashboard/projects/new', icon: '✨', section: 'deploy' },
  { label: 'Deploy', href: '/dashboard/deploy', icon: '🚀', section: 'deploy' },
  
  // Account
  { label: 'Profile', href: '/dashboard/profile', icon: '👤', section: 'account' },
  { label: 'Settings', href: '/dashboard/settings', icon: '⚙️', section: 'account' },
];

// Dynamic project links (these will be added dynamically from your projects)
// These are not in the static navLinks array, they'll be rendered separately

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  // Group links by section
  const mainLinks = navLinks.filter(link => link.section === 'main');
  const deployLinks = navLinks.filter(link => link.section === 'deploy');
  const accountLinks = navLinks.filter(link => link.section === 'account');

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-primary rounded-lg border border-primary-light text-text-white hover:bg-primary-light transition-colors"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-primary border-r border-primary-light z-40
          transform transition-transform duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:fixed lg:z-40
          w-64 flex flex-col lg:flex-shrink-0
        `}
      >
        {/* Logo/Brand */}
        <div className="p-6 border-b border-primary-light">
          <h2 className="text-xl font-bold text-text-white">Dashboard</h2>
          <p className="text-sm text-text-light mt-1">Kenmarie Technologies</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-4 overflow-y-auto">
          {/* Main Section */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-light/50 mb-2">
              Main
            </h3>
            {mainLinks.map(({ label, href, icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                  ${isActive(href)
                    ? 'bg-secondary text-text-white font-medium'
                    : 'text-text-light hover:text-text-white hover:bg-primary-light'
                  }
                `}
              >
                <span className="text-lg">{icon}</span>
                <span>{label}</span>
              </Link>
            ))}
          </div>

          {/* Projects & Deployment Section */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-light/50 mb-2">
              Projects & Deployment
            </h3>
            {deployLinks.map(({ label, href, icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                  ${isActive(href)
                    ? 'bg-secondary text-text-white font-medium'
                    : 'text-text-light hover:text-text-white hover:bg-primary-light'
                  }
                `}
              >
                <span className="text-lg">{icon}</span>
                <span>{label}</span>
              </Link>
            ))}
          </div>

          {/* Account Section */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-light/50 mb-2">
              Account
            </h3>
            {accountLinks.map(({ label, href, icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                  ${isActive(href)
                    ? 'bg-secondary text-text-white font-medium'
                    : 'text-text-light hover:text-text-white hover:bg-primary-light'
                  }
                `}
              >
                <span className="text-lg">{icon}</span>
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Back to Home */}
        <div className="p-4 border-t border-primary-light">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-light hover:text-text-white hover:bg-primary-light transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Home</span>
          </Link>
        </div>
      </aside>
    </>
  );
}