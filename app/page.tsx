import Link from 'next/link';

export const metadata = {
  title: 'Kenmarie Technologies Ltd | Technology Solutions That Help Organizations Grow',
  description:
    'Kenmarie Technologies Ltd delivers innovative, secure, and reliable digital solutions for businesses, NGOs, government agencies, and educational institutions.',
};

export default function HomePage() {
  const services = [
    { title: 'Web Hosting', href: '/services/web-hosting' },
    { title: 'Cloud Deployment', href: '/services/cloud-deployment' },
    { title: 'Azure Solutions', href: '/services/azure-solutions' },
    { title: 'DevOps Services', href: '/services/devops' },
  ];

  return (
    <main className="min-h-screen">
      {/* HERO SECTION - Minimal & Bold */}
      <section className="relative bg-background-alt overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-36">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block text-sm font-semibold uppercase tracking-widest text-secondary mb-4">
                Kenmarie Technologies Provides
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-tight tracking-tight">
                Technology Solutions That Help Organizations Grow
              </h1>
              <p className="mt-6 text-lg text-text-light leading-relaxed max-w-lg">
                Digital transformation through reliable, secure, and innovative technology
                solutions for organizations.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center px-8 py-3.5 bg-secondary hover:bg-secondary-dark text-white font-medium rounded-md transition-all duration-200 hover:shadow-custom"
                >
                  Explore Services
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center px-8 py-3.5 border-2 border-secondary text-secondary hover:bg-secondary hover:text-white font-medium rounded-md transition-all duration-200"
                >
                  About Us
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="bg-background rounded-lg border border-border shadow-custom-lg overflow-hidden">
                <div className="p-6 bg-primary">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-success"></div>
                    <div className="w-3 h-3 rounded-full bg-warning"></div>
                    <div className="w-3 h-3 rounded-full bg-danger"></div>
                    <span className="ml-2 text-text-white text-xs font-mono">kenmarie.tech</span>
                  </div>
                </div>
                <div className="p-8 bg-background-alt">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-background rounded border border-border">
                      <div className="w-10 h-10 rounded bg-secondary-100 flex items-center justify-center text-secondary font-bold text-sm">
                        K
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-primary">Kenmarie Technologies</p>
                        <p className="text-xs text-text-light">Technology Partner</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 bg-background rounded border border-border">
                        <p className="text-xs text-text-light">Security</p>
                        <p className="text-sm font-semibold text-primary">Enterprise Grade</p>
                      </div>
                      <div className="p-4 bg-background rounded border border-border">
                        <p className="text-xs text-text-light">Reliability</p>
                        <p className="text-sm font-semibold text-primary">99.9% Uptime</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES OVERVIEW - Minimal Grid */}
      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-sm font-semibold uppercase tracking-widest text-secondary">
              What We Do
            </span>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold text-primary">
              Our Services
            </h2>
            <p className="mt-3 text-text-light">
              Practical technology solutions designed for your organization.
            </p>
          </div>

          <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((service, index) => (
              <Link
                key={index}
                href={service.href}
                className="group p-6 bg-background-alt border border-border rounded-lg hover:border-secondary hover:shadow-custom transition-all duration-200 text-center"
              >
                <h3 className="text-base font-semibold text-primary group-hover:text-secondary transition-colors">
                  {service.title}
                </h3>
                <span className="inline-block mt-2 text-sm text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn More →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WHY KENMARIE - Minimal */}
      <section className="py-16 md:py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-text-white">
            Why Kenmarie
          </h2>
          <p className="mt-3 text-text-white/70 text-lg">
            Technology built around your organization.
          </p>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 border border-primary-light/30 rounded-lg">
              <p className="text-text-white font-semibold">Tailored</p>
              <p className="text-text-white/60 text-sm">Solutions</p>
            </div>
            <div className="p-4 border border-primary-light/30 rounded-lg">
              <p className="text-text-white font-semibold">Secure</p>
              <p className="text-text-white/60 text-sm">Reliable</p>
            </div>
            <div className="p-4 border border-primary-light/30 rounded-lg">
              <p className="text-text-white font-semibold">Expert</p>
              <p className="text-text-white/60 text-sm">Support</p>
            </div>
            <div className="p-4 border border-primary-light/30 rounded-lg">
              <p className="text-text-white font-semibold">Innovative</p>
              <p className="text-text-white/60 text-sm">Forward</p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA - Minimal */}
      <section className="py-16 md:py-20 bg-background-alt">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">
            Ready to Transform?
          </h2>
          <p className="mt-3 text-text-light text-lg">
            Let's discuss how technology can help your organization grow.
          </p>
          <div className="mt-6">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-secondary hover:bg-secondary-dark text-white font-medium rounded-md transition-all duration-200 hover:shadow-custom"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}