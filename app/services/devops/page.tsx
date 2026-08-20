import Link from 'next/link';

export const metadata = {
  title: 'DevOps Services | Kenmarie Technologies Ltd',
  description: 'CI/CD pipelines, infrastructure as code, and automated deployment workflows.',
};

export default function DevOpsPage() {
  const services = [
    {
      title: 'CI/CD Pipelines',
      description: 'Automated build, test, and deployment pipelines for faster and more reliable releases.',
      icon: '🔄',
    },
    {
      title: 'Infrastructure as Code',
      description: 'Manage and provision infrastructure through code using Terraform and Ansible.',
      icon: '🏗️',
    },
    {
      title: 'Container Orchestration',
      description: 'Deploy and manage containerized applications using Kubernetes and Docker.',
      icon: '🐳',
    },
    {
      title: 'Monitoring & Logging',
      description: 'Comprehensive monitoring and logging solutions for real-time insights.',
      icon: '📊',
    },
    {
      title: 'Configuration Management',
      description: 'Automated configuration management for consistent environments.',
      icon: '⚙️',
    },
    {
      title: 'Security Automation',
      description: 'Integrate security practices into your DevOps workflow with DevSecOps.',
      icon: '🔒',
    },
  ];

  const workflow = [
    {
      step: '01',
      title: 'Plan & Design',
      description: 'Assess your current infrastructure and design an optimized DevOps strategy.',
    },
    {
      step: '02',
      title: 'Implement',
      description: 'Deploy CI/CD pipelines and infrastructure automation tools.',
    },
    {
      step: '03',
      title: 'Optimize',
      description: 'Continuously improve processes and optimize for performance.',
    },
    {
      step: '04',
      title: 'Scale',
      description: 'Scale your DevOps practices as your organization grows.',
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
              Professional{' '}
              <span className="gradient-text">DevOps Services</span>
            </h1>
            
            <p className="mt-6 text-lg text-white/80 leading-relaxed max-w-2xl">
              Automated CI/CD pipelines, infrastructure as code, and comprehensive deployment workflows. Accelerate your development lifecycle.
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
              Comprehensive DevOps Solutions
            </h2>
            <p className="mt-4 text-text-light">
              Streamline your development and operations with our end-to-end DevOps services.
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

      {/* WORKFLOW SECTION */}
      <section className="py-20 md:py-28 bg-background-alt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block text-sm font-semibold uppercase tracking-widest text-secondary mb-3">
              Process
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              Our DevOps Workflow
            </h2>
            <p className="mt-4 text-text-light">
              A proven methodology to transform your development and operations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflow.map((item, index) => (
              <div
                key={index}
                className="relative bg-background border border-border rounded-xl p-6 transition-all duration-300 hover:border-secondary/50 hover:shadow-glow"
              >
                <div className="text-4xl font-bold text-secondary/20 mb-4">{item.step}</div>
                <h3 className="text-lg font-semibold text-primary mb-2">{item.title}</h3>
                <p className="text-text-light text-sm leading-relaxed">{item.description}</p>
                {index < workflow.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-border"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* METRICS SECTION */}
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block text-sm font-semibold uppercase tracking-widest text-secondary mb-3">
                Results
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
                Measurable Improvements
              </h2>
              <p className="text-text-light leading-relaxed mb-8">
                Our DevOps solutions deliver tangible results that impact your bottom line.
              </p>

              <div className="space-y-6">
                {[
                  { title: 'Deployment Frequency', value: '10x', desc: 'Faster deployments with automated pipelines' },
                  { title: 'Lead Time', value: '-70%', desc: 'Reduced time from code to production' },
                  { title: 'Failure Rate', value: '-60%', desc: 'Fewer deployment failures with testing' },
                ].map((metric, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                      <span className="text-xl font-bold text-secondary">{metric.value}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary">{metric.title}</h3>
                      <p className="text-sm text-text-light mt-1">{metric.desc}</p>
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
                      <span className="text-white/80 text-sm font-medium">Pipeline Status</span>
                      <span className="flex items-center gap-2 text-green-400 text-sm">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        All Systems Operational
                      </span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Active Pipelines</span>
                        <span className="text-white font-semibold">32</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Deployments Today</span>
                        <span className="text-white font-semibold">156</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Success Rate</span>
                        <span className="text-white font-semibold">99.2%</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
                      <p className="text-3xl font-bold text-white">&lt;5min</p>
                      <p className="text-white/60 text-xs mt-1">Avg Build Time</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
                      <p className="text-3xl font-bold text-white">24/7</p>
                      <p className="text-white/60 text-xs mt-1">Monitoring</p>
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
            Ready to Automate Your Workflow?
          </h2>
          <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
            Let's discuss how our DevOps services can help your team ship faster and more reliably.
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