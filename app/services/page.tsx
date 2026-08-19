import Link from 'next/link';

export const metadata = {
  title: 'Our Services | Kenmarie Technologies Ltd',
  description:
    'Explore our technology services including Web Hosting, Cloud Deployment, Azure Solutions, and DevOps Services.',
};

export default function ServicesPage() {
  const services = [
    {
      title: 'Web Hosting',
      description: 'High-performance hosting with 99.9% uptime.',
      icon: '🌐',
      href: '/services/web-hosting',
    },
    {
      title: 'Cloud Deployment',
      description: 'Seamless Azure deployment with auto-scaling.',
      icon: '☁️',
      href: '/services/cloud-deployment',
    },
    {
      title: 'Azure Solutions',
      description: 'Expert Azure consulting and implementation.',
      icon: '🔷',
      href: '/services/azure-solutions',
    },
    {
      title: 'DevOps Services',
      description: 'CI/CD pipelines and automated workflows.',
      icon: '⚡',
      href: '/services/devops',
    },
  ];

  return (
    <main className="min-h-screen">
      <section className="bg-background-alt border-b border-border py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-sm font-semibold uppercase tracking-widest text-secondary">
              Our Services
            </span>
            <h1 className="mt-2 text-4xl md:text-5xl font-bold text-primary tracking-tight">
              Technology Services for Your Organization
            </h1>
            <p className="mt-4 text-lg text-text-light leading-relaxed">
              Practical solutions designed to improve efficiency and support growth.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <Link
                key={index}
                href={service.href}
                className="group p-8 bg-background-alt border border-border rounded-lg hover:border-secondary hover:shadow-custom-lg transition-all duration-200"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h2 className="text-2xl font-bold text-primary group-hover:text-secondary transition-colors">
                  {service.title}
                </h2>
                <p className="mt-2 text-text-light">{service.description}</p>
                <span className="inline-block mt-4 text-secondary font-medium">
                  Learn More →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-text-white">
            Ready to Get Started?
          </h2>
          <p className="mt-3 text-text-white/80 text-lg">
            Let's discuss how our services can help your organization.
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