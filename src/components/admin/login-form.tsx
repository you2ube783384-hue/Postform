"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { PFButton } from "@/components/pf/button";

export function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        toast.success("ACCESS GRANTED");
        router.push("/admin");
        router.refresh();
      } else {
        toast.error("ACCESS DENIED", { description: "Incorrect password." });
      }
    } catch {
      toast.error("NETWORK ERROR", { description: "Try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-pf-cream px-4">
      <div className="w-full max-w-sm">
        <div className="border-2 border-pf-black bg-pf-paper pf-hard-shadow">
          <div className="border-b-2 border-pf-black bg-pf-black px-6 py-5 text-center">
            <p className="font-display text-2xl text-pf-cream">
              POSTFORM<span className="text-pf-yellow">▮</span>
            </p>
            <p className="mt-1 font-mono-tech text-[10px] uppercase tracking-[0.3em] text-pf-yellow">
              RESTRICTED — ADMIN AREA
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 px-6 py-6">
            <label className="block">
              <span className="mb-1 block font-mono-tech text-[10px] font-bold uppercase tracking-[0.2em] text-pf-black">
                ADMIN PASSWORD
              </span>
              <div className="flex border-2 border-pf-black bg-pf-paper focus-within:bg-white">
                <span className="flex w-11 items-center justify-center border-r-2 border-pf-black text-pf-muted">
                  <Lock className="h-4 w-4" strokeWidth={2.5} />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                  autoComplete="current-password"
                  placeholder="••••••••••"
                  aria-label="Admin password"
                  className="h-12 flex-1 bg-transparent px-3 font-mono-tech text-sm outline-none placeholder:text-pf-muted/50"
                />
              </div>
            </label>

            <PFButton type="submit" block size="lg" disabled={loading || !password}>
              {loading ? "VERIFYING…" : "ENTER ADMIN"} <ArrowRight className="h-4 w-4" />
            </PFButton>

            <p className="text-center font-mono-tech text-[10px] uppercase tracking-widest text-pf-muted">
              SESSION EXPIRES IN 7 DAYS
            </p>
          </form>
        </div>

        <p className="mt-4 text-center font-mono-tech text-[10px] uppercase tracking-widest text-pf-muted">
          <a href="/" className="text-pf-purple underline underline-offset-4">
            ← BACK TO STORE
          </a>
        </p>
      </div>
    </div>
  );
}
