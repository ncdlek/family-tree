export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>

        <div className="prose prose-gray dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using FamilyTree, you accept and agree to be bound by these Terms
              of Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Account Responsibilities</h2>
            <p className="text-muted-foreground leading-relaxed">
              You are responsible for maintaining the confidentiality of your account credentials
              and for all activities that occur under your account. You agree to notify us
              immediately of any unauthorized use.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">User Content</h2>
            <p className="text-muted-foreground leading-relaxed">
              You retain ownership of any content you submit to FamilyTree. By submitting content,
              you grant us a license to store, display, and process that content for the purpose
              of providing our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Acceptable Use</h2>
            <p className="text-muted-foreground leading-relaxed">
              You agree not to use FamilyTree for any illegal purpose, to harass others, or to
              submit false or inaccurate information about family relationships.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Service Availability</h2>
            <p className="text-muted-foreground leading-relaxed">
              We strive to provide reliable service but do not guarantee uninterrupted access.
              We may modify or discontinue features at any time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Termination</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to suspend or terminate your account if you violate these Terms
              of Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update these Terms of Service from time to time. Continued use of the service
              constitutes acceptance of any changes.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
