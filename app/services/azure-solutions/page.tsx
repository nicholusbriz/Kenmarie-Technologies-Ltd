import Link from 'next/link';

export const metadata = {
  title: 'Azure Solutions | Kenmarie Technologies Ltd',
  description: 'Expert Azure consulting and implementation tailored to your business needs.',
};

export default function AzureSolutionsPage() {
  return (
    <main className="min-h-screen">
      <section className="bg-background-alt border-b border-border py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="block mt-4 text-sm font-semibold uppercase tracking-widest text-secondary">
              Azure Solutions
            </span>
            <h1 className="mt-2 text-4xl md:text-5xl font-bold text-primary tracking-tight">
              Expert Azure Solutions
            </h1>
            <p className="mt-4 text-lg text-text-light leading-relaxed">
              Comprehensive Azure consulting and implementation with a focus on security and compliance.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-background-alt border border-border rounded-lg p-12 text-center">
            <div className="text-6xl mb-6">🔷</div>
            <h2 className="text-2xl font-bold text-primary mb-4">Coming Soon</h2>
            <p className="text-text-light leading-relaxed max-w-2xl mx-auto">
              We're developing comprehensive Azure solutions. More details coming.
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
            Need Azure Expertise?
          </h2>
          <p className="mt-2 text-text-white/70">
            Let's talk about your Azure requirements.
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