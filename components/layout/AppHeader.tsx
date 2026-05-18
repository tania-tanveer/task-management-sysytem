"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Trello } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";

type AppHeaderProps = {
  email?: string | null;
};

export function AppHeader({ email }: AppHeaderProps) {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/auth/login");
    router.refresh();
  }

  return (
    <header className="border-b border-line bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link className="inline-flex items-center gap-2 font-bold text-ink" href="/dashboard">
          <span className="grid size-9 place-items-center rounded-md bg-teal-700 text-white">
            <Trello size={20} />
          </span>
          <span>TaskFlow</span>
        </Link>

        <div className="flex items-center gap-3">
          {email ? <span className="hidden max-w-56 truncate text-sm text-slate-600 sm:inline">{email}</span> : null}
          <button
            className="inline-flex items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            type="button"
            onClick={handleLogout}
            title="Log out"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Log out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
