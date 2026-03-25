export default function PharmacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
        <div className="w-8 h-8 bg-boots-green rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-sm">Rx</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-primary">Pharmacy Console</h1>
          <p className="text-sm text-muted-foreground">
            Manage today&apos;s health checks
          </p>
        </div>
      </div>
      {children}
    </div>
  );
}
