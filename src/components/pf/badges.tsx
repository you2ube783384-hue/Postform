import { cn } from "@/lib/utils";
import { conditionBadgeClass } from "@/lib/format";

export function ConditionBadge({
  condition,
  className,
}: {
  condition: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 font-mono-tech text-[10px] font-bold uppercase tracking-widest border border-pf-black",
        conditionBadgeClass(condition),
        className
      )}
    >
      {condition}
    </span>
  );
}

export function StockBadge({ state }: { state: string }) {
  const soldOut = state === "SOLD OUT";
  const low = state.startsWith("LOW STOCK");
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 font-mono-tech text-[10px] font-bold uppercase tracking-widest border",
        soldOut
          ? "bg-pf-black text-pf-cream border-pf-black"
          : low
            ? "bg-pf-red text-white border-pf-red"
            : "bg-pf-paper text-pf-black border-pf-black"
      )}
    >
      {!soldOut && <span className="inline-block h-1.5 w-1.5 bg-current" aria-hidden />}
      {state}
    </span>
  );
}

export function PFCountBadge({ count, className }: { count: number; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex min-w-5 items-center justify-center bg-pf-yellow px-1 font-mono-tech text-[10px] font-bold text-pf-black border border-pf-black",
        className
      )}
    >
      {count}
    </span>
  );
}
