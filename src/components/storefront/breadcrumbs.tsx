import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function Breadcrumbs({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 font-mono-tech text-[11px] uppercase tracking-widest text-pf-muted">
      <Link href="/" className="hover:text-pf-black hover:underline">
        HOME
      </Link>
      {items.map((item) => (
        <span key={item.label} className="flex items-center gap-1">
          <ChevronRight className="h-3 w-3" aria-hidden />
          {item.href ? (
            <Link href={item.href} className="hover:text-pf-black hover:underline">
              {item.label}
            </Link>
          ) : (
            <span className="font-bold text-pf-black">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
