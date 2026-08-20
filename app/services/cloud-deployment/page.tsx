import Link from 'next/link';

export const metadata = {
  title: 'Cloud Deployment | Kenmarie Technologies Ltd',
  description: 'Seamless Azure cloud deployment with automated scaling and intelligent management.',
};

export default function CloudDeploymentPage() {
  const features = [
    {
      title: 'Automated Deployment',
      description: 'Streamlined deployment pipelines with CI/CD integration for faster time-to-market.',
      icon: '🚀',
    },
    {
      title: 'Auto Scaling',
      description: 'Intelligent scaling that adjusts resources based on demand, optimizing costs and performance.',
      icon: '📈',
    },
    {
      title: 'Load Balancing',
      description: 'Distribute traffic efficiently across multiple servers for optimal performance.',
      icon: '⚖️',
    },
    {
      title: 'Disaster Recovery',
      description: 'Comprehensive backup and recovery solutions to protect your critical data.',
      icon: '🔄',
    },
    {
      title: 'Monitoring & Analytics',
      description: 'Real-time monitoring and detailed analytics to keep your applications running smoothly.',
      icon: '📊',
    },
    {
      title: 'Cost Optimization',
      description: 'Smart resource management to minimize cloud costs while maintaining performance.',
      icon: '💰',
    },
  ];

  const solutions = [
    {
      title: 'Application Migration',
      description: 'Seamlessly migrate your existing applications to Azure with minimal downtime.',
      icon: '🔄',
    },
    {
      title: 'Cloud-Native Development',
      description: 'Build and deploy cloud-native applications using microservices architecture.',
      icon: '🏗️',
    },
    {
      title: 'Hybrid Cloud Setup',
      description: 'Integrate on-premises infrastructure with cloud resources for optimal flexibility.',
      icon: '🔗',
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
              Seamless Azure{' '}
              <span className="gradient-text">Cloud Deployment</span>
            </h1>
            
            <p className="mt-6 text-lg text-white/80 leading-relaxed max-w-2xl">
              Automated cloud deployment with intelligent scaling, load balancing, and comprehensive management. Transform your infrastructure with Azure.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-secondary hover:bg-secondary-dark text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-glow hover-lift"
              >
                Start Your Journey
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
              Powerful Cloud Capabilities
            </h2>
            <p className="mt-4 text-text-light">
              Leverage the full power of Azure with our comprehensive cloud deployment solutions.
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

      {/* SOLUTIONS SECTION */}
      <section className="py-20 md:py-28 bg-background-alt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block text-sm font-semibold uppercase tracking-widest text-secondary mb-3">
                Solutions
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
                Tailored Cloud Solutions
              </h2>
              <p className="text-text-light leading-relaxed mb-8">
                Whether you're migrating existing applications or building new cloud-native solutions, we provide the expertise and tools you need.
              </p>

              <div className="space-y-6">
                {solutions.map((solution, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center text-2xl">
                      {solution.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary">{solution.title}</h3>
                      <p className="text-sm text-text-light mt-1">{solution.description}</p>
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
                      <span className="text-white/80 text-sm font-medium">Deployment Status</span>
                      <span className="flex items-center gap-2 text-green-400 text-sm">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        Active
                      </span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Applications Deployed</span>
                        <span className="text-white font-semibold">45</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Uptime</span>
                        <span className="text-white font-semibold">99.95%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Cost Savings</span>
                        <span className="text-white font-semibold">35%</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
                      <p className="text-3xl font-bold text-white">24/7</p>
                      <p className="text-white/60 text-xs mt-1">Monitoring</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
                      <p className="text-3xl font-bold text-white">&lt;5min</p>
                      <p className="text-white/60 text-xs mt-1">Deployment Time</p>
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
            Ready to Transform Your Infrastructure?
          </h2>
          <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
            Let's discuss how our cloud deployment solutions can help your business scale efficiently.
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