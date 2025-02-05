import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UserProfile } from "@/lib/profile/UserProfile";

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your dashboard</p>
        </div>
        <Button>Get Started</Button>
      </header>

      <Separator />
      <UserProfile />
      <Separator />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold">Quick Stats</h3>
          <p className="text-sm text-muted-foreground">Overview of your activity</p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold">Recent Activity</h3>
          <p className="text-sm text-muted-foreground">Your latest actions</p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold">Resources</h3>
          <p className="text-sm text-muted-foreground">Helpful links and docs</p>
        </div>
      </div>
    </div>
  );
}
