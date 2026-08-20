import Link from 'next/link';

export const metadata = {
  title: 'Azure Solutions | Kenmarie Technologies Ltd',
  description: 'Expert Azure consulting and implementation tailored to your business needs.',
};

export default function AzureSolutionsPage() {
  const services = [
    {
      title: 'Azure Consulting',
      description: 'Strategic guidance to help you leverage Azure services for maximum business value.',
      icon: '💼',
    },
    {
      title: 'Cloud Migration',
      description: 'Seamless migration of your existing infrastructure and applications to Azure.',
      icon: '🔄',
    },
    {
      title: 'Azure DevOps',
      description: 'Implement CI/CD pipelines and infrastructure as code using Azure DevOps.',
      icon: '🔧',
    },
    {
      title: 'Security & Compliance',
      description: 'Enterprise-grade security implementations and compliance with industry standards.',
      icon: '🔒',
    },
    {
      title: 'Data & Analytics',
      description: 'Harness the power of Azure data services for insights and decision-making.',
      icon: '📊',
    },
    {
      title: 'AI & Machine Learning',
      description: 'Build intelligent applications using Azure AI and ML services.',
      icon: '🤖',
    },
  ];

  const benefits = [
    {
      title: 'Cost Efficiency',
      description: 'Optimize your cloud spending with right-sizing and reserved instances.',
      icon: '💰',
    },
    {
      title: 'Scalability',
      description: 'Scale resources up or down based on your business needs.',
      icon: '📈',
    },
    {
      title: 'Global Reach',
      description: 'Deploy applications in data centers around the world for low latency.',
      icon: '🌍',
    },
    {
      title: 'Security',
      description: 'Enterprise-grade security with advanced threat protection.',
      icon: '🛡️',
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
              Expert Azure{' '}
              <span className="gradient-text">Solutions</span>
            </h1>
            
            <p className="mt-6 text-lg text-white/80 leading-relaxed max-w-2xl">
              Comprehensive Azure consulting and implementation with a focus on security, compliance, and business value. Transform your operations with Microsoft Azure.
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

      {/* SERVICES SECTION */}
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block text-sm font-semibold uppercase tracking-widest text-secondary mb-3">
              Services
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              Comprehensive Azure Services
            </h2>
            <p className="mt-4 text-text-light">
              From strategy to implementation, we provide end-to-end Azure solutions tailored to your business.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="card-shine hover-lift bg-background-alt border border-border rounded-xl p-6 transition-all duration-300 hover:border-secondary/50 hover:shadow-glow"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold text-primary mb-2">{service.title}</h3>
                <p className="text-text-light text-sm leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS SECTION */}
      <section className="py-20 md:py-28 bg-background-alt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block text-sm font-semibold uppercase tracking-widest text-secondary mb-3">
                Why Azure
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
                Benefits of Azure
              </h2>
              <p className="text-text-light leading-relaxed mb-8">
                Microsoft Azure offers a comprehensive set of cloud services that help organizations meet their business challenges.
              </p>

              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center text-2xl">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary">{benefit.title}</h3>
                      <p className="text-sm text-text-light mt-1">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-primary to-primary-light rounded-2xl p-8 shadow-custom-xl">
                <div className="space-y-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-white/80 text-sm font-medium">Azure Partnership</span>
                      <span className="flex items-center gap-2 text-green-400 text-sm">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        Certified Partner
                      </span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Projects Completed</span>
                        <span className="text-white font-semibold">75+</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Certified Engineers</span>
                        <span className="text-white font-semibold">12</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Client Satisfaction</span>
                        <span className="text-white font-semibold">98%</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
                      <p className="text-3xl font-bold text-white">200+</p>
                      <p className="text-white/60 text-xs mt-1">Services Supported</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
                      <p className="text-3xl font-bold text-white">50+</p>
                      <p className="text-white/60 text-xs mt-1">Regions Worldwide</p>
                    </div>
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
            Ready to Harness the Power of Azure?
          </h2>
          <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
            Let's discuss how our Azure expertise can help your organization achieve its digital transformation goals.
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