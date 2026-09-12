"use client";

import React from "react";
import Link from "next/link";

/**
 * POSTFORM storefront error boundary (spec §32):
 * understandable, non-technical message + explicit retry.
 */
export default function StorefrontError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Surface digest server-side / in logs without exposing it to customers
    console.error("[storefront]", error.message, error.digest);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col items-center gap-6 px-4 py-24 text-center sm:px-8 lg:px-12">
      <p className="font-mono-tech text-[10px] font-bold uppercase tracking-[0.3em] text-pf-purple">
        ERROR {error.digest ? `— ${error.digest.slice(0, 8)}` : ""}
      </p>
      <h1 className="font-display text-4xl uppercase leading-none text-pf-black sm:text-5xl">
        Something went wrong
      </h1>
      <p className="max-w-md text-sm text-pf-muted">
        The rack jammed while loading this page. Please try again — your cart
        and saved items are untouched.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="border-2 border-pf-black bg-pf-yellow px-8 py-3.5 font-mono-tech text-xs font-bold uppercase tracking-widest text-pf-black pf-press hover:-translate-x-[2px] hover:-translate-y-[2px] hover:pf-hard-shadow-sm"
        >
          Retry
        </button>
        <Link
          href="/"
          className="border-2 border-pf-black bg-pf-paper px-8 py-3.5 font-mono-tech text-xs font-bold uppercase tracking-widest text-pf-black pf-press hover:-translate-x-[2px] hover:-translate-y-[2px] hover:pf-hard-shadow-sm"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
