import { Outlet } from "react-router";

export default function MainLayout() {
  return (
    <div className="min-h-svh w-full bg-bg-primary text-text-primary">
      <main className="mx-auto flex min-h-svh w-full max-w-7xl flex-1 flex-col px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}