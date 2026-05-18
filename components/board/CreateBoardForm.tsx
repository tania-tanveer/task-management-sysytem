"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";

type CreateBoardFormProps = {
  userId: string;
};

export function CreateBoardForm({ userId }: CreateBoardFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    setIsLoading(true);
    setError(null);

    const { error: insertError } = await supabase.from("boards").insert({
      title: trimmed,
      user_id: userId
    });

    setIsLoading(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setTitle("");
    router.refresh();
  }

  return (
    <form className="rounded-lg border border-line bg-white p-4 shadow-sm" onSubmit={handleSubmit}>
      <label className="block">
        <span className="text-sm font-medium text-slate-700">New board</span>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input
            className="min-w-0 flex-1 rounded-md border border-line px-3 py-2 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Product launch"
          />
          <button
            className="inline-flex items-center justify-center gap-2 rounded-md bg-teal-700 px-4 py-2 font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-70"
            type="submit"
            disabled={isLoading}
          >
            <Plus size={18} />
            Add
          </button>
        </div>
      </label>
      {error ? <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
    </form>
  );
}
