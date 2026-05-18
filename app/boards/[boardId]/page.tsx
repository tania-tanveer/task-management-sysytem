import { notFound, redirect } from "next/navigation";
import { AppHeader } from "@/components/layout/AppHeader";
import { BoardView } from "@/components/board/BoardView";
import { createClient } from "@/lib/supabase/server";

type BoardPageProps = {
  params: {
    boardId: string;
  };
};

export default async function BoardPage({ params }: BoardPageProps) {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: board } = await supabase
    .from("boards")
    .select("*")
    .eq("id", params.boardId)
    .eq("user_id", user.id)
    .single();

  if (!board) {
    notFound();
  }

  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("board_id", board.id)
    .eq("user_id", user.id)
    .order("status", { ascending: true })
    .order("position", { ascending: true });

  return (
    <div className="min-h-screen bg-mist">
      <AppHeader email={user.email} />
      <BoardView board={board} initialTasks={tasks ?? []} userId={user.id} />
    </div>
  );
}
