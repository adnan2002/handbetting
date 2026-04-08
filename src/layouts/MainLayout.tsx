import { Outlet } from "react-router";

export default function MainLayout() {
  return (
    <div className="min-h-svh bg-bg-primary text-text-primary flex items-center justify-center">
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 flex items-center justify-center">
        <Outlet />
      </main>
    </div>
  );
}