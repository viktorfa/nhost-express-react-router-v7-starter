export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your dashboard</p>
        </div>
      </header>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold">Quick Stats</h3>
          <p className="text-sm text-muted-foreground">Overview of your activity</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold">Quick Stats</h3>
          <p className="text-sm text-muted-foreground">Overview of your activity</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold">Quick Stats</h3>
          <p className="text-sm text-muted-foreground">Overview of your activity</p>
        </div>
      </div>
    </div>
  );
}
