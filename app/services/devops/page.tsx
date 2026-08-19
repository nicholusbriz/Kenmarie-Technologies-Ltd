import Link from 'next/link';

export const metadata = {
  title: 'DevOps Services | Kenmarie Technologies Ltd',
  description: 'CI/CD pipelines, infrastructure as code, and automated deployment workflows.',
};

export default function DevOpsPage() {
  return (
    <main className="min-h-screen">
      <section className="bg-background-alt border-b border-border py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="block mt-4 text-sm font-semibold uppercase tracking-widest text-secondary">
              DevOps Services
            </span>
            <h1 className="mt-2 text-4xl md:text-5xl font-bold text-primary tracking-tight">
              Professional DevOps Services
            </h1>
            <p className="mt-4 text-lg text-text-light leading-relaxed">
              Automated CI/CD pipelines, infrastructure as code, and comprehensive deployment workflows.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-background-alt border border-border rounded-lg p-12 text-center">
            <div className="text-6xl mb-6">⚡</div>
            <h2 className="text-2xl font-bold text-primary mb-4">Coming Soon</h2>
            <p className="text-text-light leading-relaxed max-w-2xl mx-auto">
              We're preparing our DevOps services. More information coming.
            </p>
            <Link
              href="/services"
              className="inline-flex items-center mt-6 text-secondary hover:text-secondary-dark font-medium transition-colors"
            >
              Return to Services →
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-text-white">
            Automate Your Workflow?
          </h2>
          <p className="mt-2 text-text-white/70">
            Let's discuss how DevOps can help your team.
          </p>
          <div className="mt-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-2.5 bg-secondary hover:bg-secondary-dark text-white font-medium rounded-md transition-all duration-200"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}