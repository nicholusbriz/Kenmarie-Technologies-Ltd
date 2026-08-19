import Link from 'next/link';

export const metadata = {
  title: 'About Kenmarie Technologies Ltd',
  description:
    'Learn about Kenmarie Technologies — our mission, values, and commitment to helping organizations embrace digital transformation.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <section className="bg-background-alt border-b border-border py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-sm font-semibold uppercase tracking-widest text-secondary">
              About Us
            </span>
            <h1 className="mt-2 text-4xl md:text-5xl font-bold text-primary tracking-tight">
              Technology. Innovation. Growth.
            </h1>
            <p className="mt-4 text-lg text-text-light leading-relaxed">
              Kenmarie Technologies Ltd is a technology company focused on helping organizations
              embrace digital transformation through reliable, secure, and innovative solutions.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-primary">Our Mission</h2>
              <p className="mt-3 text-text-light leading-relaxed">
                We are committed to providing cutting-edge technology solutions that
                empower organizations to achieve their full potential through digital
                transformation.
              </p>
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-primary">Our Values</h3>
                <ul className="mt-3 space-y-2">
                  <li className="flex items-center gap-2 text-text">
                    <span className="text-secondary">✓</span> Trust & Transparency
                  </li>
                  <li className="flex items-center gap-2 text-text">
                    <span className="text-secondary">✓</span> Innovation & Excellence
                  </li>
                  <li className="flex items-center gap-2 text-text">
                    <span className="text-secondary">✓</span> Customer Partnership
                  </li>
                  <li className="flex items-center gap-2 text-text">
                    <span className="text-secondary">✓</span> Security & Reliability
                  </li>
                </ul>
              </div>
            </div>
            <div className="bg-background-alt p-8 rounded-lg border border-border">
              <h3 className="text-lg font-semibold text-primary">Who We Serve</h3>
              <ul className="mt-3 space-y-3">
                <li>
                  <p className="font-medium text-primary">Businesses</p>
                  <p className="text-sm text-text-light">Enterprise solutions for growth</p>
                </li>
                <li>
                  <p className="font-medium text-primary">Education</p>
                  <p className="text-sm text-text-light">Digital learning platforms</p>
                </li>
                <li>
                  <p className="font-medium text-primary">NGOs & Government</p>
                  <p className="text-sm text-text-light">Secure, scalable technology</p>
                </li>
                <li>
                  <p className="font-medium text-primary">Startups</p>
                  <p className="text-sm text-text-light">Flexible, innovative solutions</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-text-white">
            Partner with Kenmarie
          </h2>
          <p className="mt-3 text-text-white/80 text-lg">
            Let's build technology that helps your organization grow.
          </p>
          <div className="mt-6">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-secondary hover:bg-secondary-dark text-white font-medium rounded-md transition-all duration-200 hover:shadow-custom"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}