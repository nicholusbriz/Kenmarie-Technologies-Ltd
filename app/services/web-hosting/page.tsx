import Link from 'next/link';

export const metadata = {
  title: 'Web Hosting | Kenmarie Technologies Ltd',
  description: 'High-performance web hosting with 99.9% uptime and 24/7 support.',
};

export default function WebHostingPage() {
  const features = [
    {
      title: '99.9% Uptime Guarantee',
      description: 'Our enterprise-grade infrastructure ensures your website is always available when your customers need it.',
      icon: '⚡',
    },
    {
      title: 'SSD Storage',
      description: 'Lightning-fast NVMe SSD storage for optimal website performance and quick load times.',
      icon: '💾',
    },
    {
      title: '24/7 Expert Support',
      description: 'Round-the-clock technical support from our team of hosting experts.',
      icon: '🛠️',
    },
    {
      title: 'Free SSL Certificate',
      description: 'Keep your site secure with free SSL certificates for all domains.',
      icon: '🔒',
    },
    {
      title: 'Daily Backups',
      description: 'Automatic daily backups with one-click restore functionality.',
      icon: '📦',
    },
    {
      title: 'DDoS Protection',
      description: 'Advanced DDoS protection to keep your site safe from attacks.',
      icon: '🛡️',
    },
  ];

  const plans = [
    {
      name: 'Starter',
      price: 'KES 2,500',
      period: '/month',
      description: 'Perfect for personal websites and small projects',
      features: [
        '1 Website',
        '10GB SSD Storage',
        'Unlimited Bandwidth',
        'Free SSL Certificate',
        'Daily Backups',
        'Email Support',
      ],
      popular: false,
    },
    {
      name: 'Professional',
      price: 'KES 5,000',
      period: '/month',
      description: 'Ideal for growing businesses',
      features: [
        '5 Websites',
        '50GB SSD Storage',
        'Unlimited Bandwidth',
        'Free SSL Certificate',
        'Daily Backups',
        'Priority Support',
        'Free Domain (1 year)',
      ],
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'KES 15,000',
      period: '/month',
      description: 'For large-scale operations',
      features: [
        'Unlimited Websites',
        '500GB SSD Storage',
        'Unlimited Bandwidth',
        'Free SSL Certificate',
        'Hourly Backups',
        'Dedicated Support',
        'Free Domain (1 year)',
        'CDN Integration',
      ],
      popular: false,
    },
  ];

  return (
    <main className="min-h-screen">
      {/* HERO SECTION */}
      <section className="relative gradient-bg overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-secondary/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
              High-Performance{' '}
              <span className="gradient-text">Web Hosting</span>
            </h1>
            
            <p className="mt-6 text-lg text-white/80 leading-relaxed max-w-2xl">
              Enterprise-grade hosting with 99.9% uptime, lightning-fast SSD storage, and round-the-clock expert support. Your website deserves the best.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-secondary hover:bg-secondary-dark text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-glow hover-lift"
              >
                Get Started
                <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-all duration-300 border border-white/20 backdrop-blur-sm hover-lift"
              >
                View All Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block text-sm font-semibold uppercase tracking-widest text-secondary mb-3">
              Features
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              Everything You Need
            </h2>
            <p className="mt-4 text-text-light">
              Our hosting plans come packed with features to ensure your website performs at its best.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card-shine hover-lift bg-background-alt border border-border rounded-xl p-6 transition-all duration-300 hover:border-secondary/50 hover:shadow-glow"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-primary mb-2">{feature.title}</h3>
                <p className="text-text-light text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section className="py-20 md:py-28 bg-background-alt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block text-sm font-semibold uppercase tracking-widest text-secondary mb-3">
              Pricing
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-4 text-text-light">
              Choose the plan that fits your needs. No hidden fees, no surprises.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-background border rounded-xl p-8 transition-all duration-300 hover-lift ${
                  plan.popular
                    ? 'border-secondary shadow-glow scale-105'
                    : 'border-border hover:border-secondary/50'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center px-4 py-1 bg-secondary text-white text-sm font-semibold rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <h3 className="text-2xl font-bold text-primary mb-2">{plan.name}</h3>
                <p className="text-text-light text-sm mb-6">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-primary">{plan.price}</span>
                  <span className="text-text-light">{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3 text-sm">
                      <svg className="w-5 h-5 text-secondary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-text-light">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/contact"
                  className={`block w-full text-center py-3 rounded-lg font-semibold transition-all duration-300 ${
                    plan.popular
                      ? 'bg-secondary hover:bg-secondary-dark text-white'
                      : 'bg-primary hover:bg-primary-light text-white'
                  }`}
                >
                  Get Started
                </Link>
              </div>
            ))}
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
            Ready to Launch Your Website?
          </h2>
          <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
            Get started with our high-performance hosting today and experience the difference.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary font-semibold rounded-lg transition-all duration-300 hover:shadow-glow hover-lift"
            >
              Contact Us
              <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}