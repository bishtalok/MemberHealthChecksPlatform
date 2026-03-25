import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-primary">
          Welcome to Boots Health Checks
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Your personalised health check journey, powered by Boots pharmacy
          expertise. Get checked, understand your results, and take action.
        </p>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
            <div className="w-12 h-12 bg-boots-light-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">1</span>
            </div>
            <h3 className="font-semibold mb-2">Pre-Assessment</h3>
            <p className="text-sm text-muted-foreground">
              Complete a quick health questionnaire from the comfort of your
              home.
            </p>
          </div>

          <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
            <div className="w-12 h-12 bg-boots-light-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">2</span>
            </div>
            <h3 className="font-semibold mb-2">In-Store Check</h3>
            <p className="text-sm text-muted-foreground">
              Visit your local Boots for a professional health check with our
              pharmacists.
            </p>
          </div>

          <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
            <div className="w-12 h-12 bg-boots-light-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">3</span>
            </div>
            <h3 className="font-semibold mb-2">Results & Actions</h3>
            <p className="text-sm text-muted-foreground">
              Understand your results in plain English with clear next steps.
            </p>
          </div>
        </div>

        <div className="mt-10 space-y-4">
          <Link
            href="/entry?token=mock-token&insurer=vitality&member_id=VTL-12345"
            className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-md font-semibold hover:bg-boots-blue transition-colors"
          >
            Start Demo Journey
          </Link>
          <p className="text-sm text-muted-foreground">
            This is a prototype demo. Click above to simulate an insurer
            handoff.
          </p>
        </div>
      </div>
    </div>
  );
}
