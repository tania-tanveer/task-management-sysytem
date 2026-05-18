import Link from "next/link";
import { redirect } from "next/navigation";
import { LayoutDashboard } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { CreateBoardForm } from "@/components/board/CreateBoardForm";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: boards, error } = await supabase
    .from("boards")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  return (
    <div className="min-h-screen bg-mist">
      <AppHeader email={user.email} />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Dashboard</p>
            <h1 className="mt-1 text-3xl font-bold text-ink">Your boards</h1>
          </div>
        </div>

        <CreateBoardForm userId={user.id} />

        {error ? <p className="mt-6 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error.message}</p> : null}

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {boards?.map((board) => (
            <Link
              className="group rounded-lg border border-line bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-panel"
              href={`/boards/${board.id}`}
              key={board.id}
            >
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-md bg-cyan-50 text-cyan-700">
                  <LayoutDashboard size={20} />
                </span>
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-semibold text-ink">{board.title}</h2>
                  <p className="text-sm text-slate-500">To Do / In Progress / Done</p>
                </div>
              </div>
            </Link>
          ))}
        </section>

        {boards?.length === 0 ? (
          <div className="mt-8 rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
            Create your first board to start organizing tasks.
          </div>
        ) : null}
      </main>
    </div>
  );
}
