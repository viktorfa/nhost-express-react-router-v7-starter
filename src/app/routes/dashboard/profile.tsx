import { UserProfile } from "@/lib/profile/UserProfile";

export default function UserProfilePage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Profile</h1>
        </div>
      </header>

      <UserProfile />
    </div>
  );
}
