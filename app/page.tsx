import Link from 'next/link';

export const metadata = {
  title: 'Kenmarie Technologies Ltd | Technology Solutions That Help Organizations Grow',
  description:
    'Kenmarie Technologies Ltd delivers innovative, secure, and reliable digital solutions for businesses, NGOs, government agencies, and educational institutions.',
};

export default function HomePage() {
  const services = [
    { 
      title: 'Web Hosting', 
      href: '/services/web-hosting',
      description: 'High-performance hosting with 99.9% uptime guarantee',
      icon: '🌐'
    },
    { 
      title: 'Cloud Deployment', 
      href: '/services/cloud-deployment',
      description: 'Seamless Azure cloud deployment and scaling',
      icon: '☁️'
    },
    { 
      title: 'Azure Solutions', 
      href: '/services/azure-solutions',
      description: 'Expert Azure consulting and implementation',
      icon: '🔷'
    },
    { 
      title: 'DevOps Services', 
      href: '/services/devops',
      description: 'Automated CI/CD pipelines and workflows',
      icon: '⚡'
    },
  ];

  const stats = [
    { value: '99.9%', label: 'Uptime Guarantee' },
    { value: '24/7', label: 'Expert Support' },
    { value: '50+', label: 'Projects Delivered' },
    { value: '100%', label: 'Client Satisfaction' },
  ];

  return (
    <main className="min-h-screen">
      {/* HERO SECTION - Modern & Dynamic */}
      <section className="relative gradient-bg overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-secondary/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-40">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="animate-slide-up">
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
                Technology Solutions That{' '}
                <span className="gradient-text">Empower Growth</span>
              </h1>
              
              <p className="mt-6 text-lg text-white/80 leading-relaxed max-w-xl">
                We deliver innovative, secure, and reliable digital solutions tailored for businesses, NGOs, government agencies, and educational institutions.
              </p>
              
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center px-8 py-4 bg-secondary hover:bg-secondary-dark text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-glow hover-lift"
                >
                  Explore Services
                  <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-all duration-300 border border-white/20 backdrop-blur-sm hover-lift"
                >
                  Learn More
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="mt-12 pt-8 border-t border-white/10">
                <p className="text-sm text-white/60 mb-4">Trusted by leading organizations</p>
                <div className="flex gap-8">
                  {['ISO 27001', 'SOC 2', 'GDPR'].map((cert) => (
                    <span key={cert} className="text-white/40 text-sm font-medium">
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative animate-scale-in">
              <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="ml-2 text-white/60 text-xs font-mono">dashboard.kenmarie.tech</span>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-white/10 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-white/80 text-sm font-medium">System Status</span>
                      <span className="flex items-center gap-2 text-green-400 text-sm">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        Operational
                      </span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full w-[95%] bg-gradient-to-r from-secondary to-accent rounded-full"></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 rounded-lg p-4 border border-white/10">
                      <p className="text-white/60 text-xs mb-1">Active Projects</p>
                      <p className="text-white text-2xl font-bold">24</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 border border-white/10">
                      <p className="text-white/60 text-xs mb-1">Team Members</p>
                      <p className="text-white text-2xl font-bold">18</p>
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-secondary to-accent flex items-center justify-center text-white font-bold">
                        K
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">Kenmarie Technologies</p>
                        <p className="text-white/60 text-xs">Your Technology Partner</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-secondary to-accent rounded-xl opacity-20 blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-accent rounded-xl opacity-20 blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-16 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl md:text-4xl font-bold gradient-text">{stat.value}</p>
                <p className="mt-2 text-sm text-text-light">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES OVERVIEW - Bento Grid */}
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block text-sm font-semibold uppercase tracking-widest text-secondary mb-3">
              What We Do
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              Comprehensive Technology Services
            </h2>
            <p className="mt-4 text-text-light">
              End-to-end solutions designed to transform your organization's digital infrastructure.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <Link
                key={index}
                href={service.href}
                className="group card-shine hover-lift bg-background-alt border border-border rounded-xl p-8 transition-all duration-300 hover:border-secondary/50 hover:shadow-glow"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl mb-2">{service.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-primary group-hover:text-secondary transition-colors">
                      {service.title}
                    </h3>
                    <p className="mt-2 text-text-light text-sm leading-relaxed">
                      {service.description}
                    </p>
                    <div className="mt-4 flex items-center text-secondary text-sm font-medium">
                      Learn More
                      <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-20 md:py-28 bg-background-alt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block text-sm font-semibold uppercase tracking-widest text-secondary mb-3">
                Why Kenmarie
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-primary">
                Built for Your Success
              </h2>
              <p className="mt-4 text-text-light leading-relaxed">
                We combine technical expertise with a deep understanding of organizational needs to deliver solutions that drive real results.
              </p>

              <div className="mt-8 space-y-6">
                {[
                  { title: 'Tailored Solutions', desc: 'Customized approaches that fit your unique requirements' },
                  { title: 'Enterprise Security', desc: 'Bank-grade security protocols and compliance standards' },
                  { title: 'Expert Support', desc: 'Dedicated team available around the clock' },
                  { title: 'Innovation First', desc: 'Cutting-edge technology to keep you ahead' },
                ].map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary">{item.title}</h3>
                      <p className="text-sm text-text-light mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-primary to-primary-light rounded-2xl p-8 shadow-custom-xl">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <p className="text-white font-semibold">Security First</p>
                    <p className="text-white/60 text-sm mt-1">Enterprise-grade protection</p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <p className="text-white font-semibold">Fast Delivery</p>
                    <p className="text-white/60 text-sm mt-1">Rapid implementation</p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <p className="text-white font-semibold">Expert Team</p>
                    <p className="text-white/60 text-sm mt-1">Skilled professionals</p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <p className="text-white font-semibold">Proven Results</p>
                    <p className="text-white/60 text-sm mt-1">Track record of success</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 md:py-28 gradient-bg relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Ready to Transform Your Organization?
          </h2>
          <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
            Let's discuss how our technology solutions can help your organization achieve its goals.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary font-semibold rounded-lg transition-all duration-300 hover:shadow-glow hover-lift"
            >
              Get Started Today
              <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-all duration-300 border border-white/20 backdrop-blur-sm hover-lift"
            >
              View Our Services
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}