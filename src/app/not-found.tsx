import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <p className="font-mono-tech text-[10px] font-bold uppercase tracking-[0.3em] text-pf-purple">
        ERROR 404 — FILE NOT FOUND
      </p>
      <h1 className="mt-4 font-display text-6xl uppercase leading-none text-pf-black sm:text-8xl">
        Dead<br />End<span className="text-pf-yellow" style={{ WebkitTextStroke: "3px #141310" }}>.</span>
      </h1>
      <p className="mt-6 max-w-md text-sm leading-relaxed text-pf-muted">
        This page doesn&apos;t exist — or the piece you were looking for has already rotated out of stock.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="border-2 border-pf-black bg-pf-yellow px-8 py-3.5 font-mono-tech text-xs font-bold uppercase tracking-widest text-pf-black pf-press hover:-translate-x-[2px] hover:-translate-y-[2px] hover:pf-hard-shadow-sm"
        >
          Back to home
        </Link>
        <Link
          href="/shop"
          className="border-2 border-pf-black bg-pf-paper px-6 py-3.5 font-mono-tech text-xs font-bold uppercase tracking-widest text-pf-black transition-colors hover:bg-pf-sand"
        >
          Shop the catalogue
        </Link>
      </div>
    </div>
  );
}
