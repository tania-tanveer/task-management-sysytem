"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogIn } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const message = new URLSearchParams(window.location.search).get("message");
    if (message) {
      setError(message);
    }
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    setIsLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-mist px-4 py-10">
      <section className="w-full max-w-md rounded-lg border border-line bg-white p-8 shadow-panel">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Task Management</p>
          <h1 className="mt-2 text-3xl font-bold text-ink">Log in</h1>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Email</span>
            <input
              className="mt-2 w-full rounded-md border border-line px-3 py-2 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Password</span>
            <input
              className="mt-2 w-full rounded-md border border-line px-3 py-2 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

          <button
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-teal-700 px-4 py-2.5 font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-70"
            type="submit"
            disabled={isLoading}
          >
            <LogIn size={18} />
            {isLoading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          New here?{" "}
          <Link className="font-semibold text-teal-700 hover:text-teal-800" href="/auth/signup">
            Create an account
          </Link>
        </p>
      </section>
    </main>
  );
}
