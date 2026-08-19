export const metadata = {
  title: 'Contact Kenmarie Technologies Ltd',
  description:
    'Get in touch with Kenmarie Technologies Ltd. We\'re here to help your organization embrace digital transformation.',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      {/* Page Header */}
      <section className="bg-background-alt border-b border-border py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-sm font-semibold uppercase tracking-widest text-secondary">
              Contact Us
            </span>
            <h1 className="mt-2 text-4xl md:text-5xl font-bold text-primary tracking-tight">
              Let's Start a Conversation
            </h1>
            <p className="mt-4 text-lg text-text-light leading-relaxed">
              Whether you're ready to start a project or just want to learn more about
              how we can help your organization, we'd love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Email */}
            <div className="bg-background-alt p-8 rounded-lg border border-border">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-text-light mb-2">
                Email
              </h3>
              <a
                href="mailto:info@kenmarie.tech"
                className="text-xl text-primary hover:text-secondary transition-colors font-medium"
              >
                info@kenmarie.tech
              </a>
            </div>

            {/* Phone */}
            <div className="bg-background-alt p-8 rounded-lg border border-border">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-text-light mb-2">
                Phone
              </h3>
              <p className="text-xl text-primary font-medium">
                +1 (555) 123-4567
              </p>
            </div>

            {/* Location */}
            <div className="bg-background-alt p-8 rounded-lg border border-border">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-text-light mb-2">
                Location
              </h3>
              <p className="text-xl text-primary font-medium">
                Nairobi, Kenya
              </p>
            </div>

            {/* Social Links */}
            <div className="bg-background-alt p-8 rounded-lg border border-border">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-text-light mb-4">
                Connect With Us
              </h3>
              <div className="flex gap-3">
                <a
                  href="#"
                  aria-label="LinkedIn"
                  className="w-11 h-11 rounded-lg flex items-center justify-center bg-background hover:bg-secondary border border-border hover:border-secondary transition-all duration-200"
                >
                  <svg className="w-5 h-5 text-text hover:text-text-white transition-colors duration-200" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a
                  href="#"
                  aria-label="GitHub"
                  className="w-11 h-11 rounded-lg flex items-center justify-center bg-background hover:bg-secondary border border-border hover:border-secondary transition-all duration-200"
                >
                  <svg className="w-5 h-5 text-text hover:text-text-white transition-colors duration-200" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
                <a
                  href="#"
                  aria-label="Twitter"
                  className="w-11 h-11 rounded-lg flex items-center justify-center bg-background hover:bg-secondary border border-border hover:border-secondary transition-all duration-200"
                >
                  <svg className="w-5 h-5 text-text hover:text-text-white transition-colors duration-200" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-text-white">
            Ready to Transform Your Organization?
          </h2>
          <p className="mt-4 text-text-white/80 text-lg leading-relaxed max-w-2xl mx-auto">
            Let's discuss how technology can help your organization improve efficiency,
            strengthen security, and achieve its goals.
          </p>
          <div className="mt-8">
            <a
              href="mailto:info@kenmarie.tech"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-secondary hover:bg-secondary-dark text-white font-medium rounded-md transition-all duration-200 hover:shadow-custom"
            >
              Email Us Directly
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}