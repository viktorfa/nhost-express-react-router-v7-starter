import { Outlet } from "react-router";
import { Header } from "@/lib/layout/Header";
import { Toaster } from "sonner";
export default function RootLayout() {
  return (
    <>
      <Header />
      <main className="mt-16 mx-2 sm:mx-auto max-w-[1024px]">
        <Outlet />
        <Toaster />
      </main>
    </>
  );
}
