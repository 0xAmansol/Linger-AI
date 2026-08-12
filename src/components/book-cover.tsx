import { cn } from "@/lib/utils";

// A small, fixed palette of muted "cloth" tints for generated covers — never
// a random/bright color, so a shelf of un-covered books still reads calm.
const CLOTH_TINTS = [
  "bg-[#5a4a3a] text-[#f0e9dc]",
  "bg-[#3f4a42] text-[#e9efe9]",
  "bg-[#4a3f4a] text-[#efe9ef]",
  "bg-[#463a3a] text-[#efe4e4]",
  "bg-[#3a4048] text-[#e4e9ef]",
];

function tintFor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return CLOTH_TINTS[hash % CLOTH_TINTS.length];
}

export function BookCover({
  title,
  coverUrl,
  className,
}: {
  title: string;
  coverUrl?: string | null;
  className?: string;
}) {
  if (coverUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- external, unpredictable cover sources
      <img
        src={coverUrl}
        alt=""
        className={cn("aspect-[2/3] w-full rounded-sm object-cover", className)}
      />
    );
  }

  const initial = title.trim().charAt(0).toUpperCase() || "?";
  return (
    <div
      className={cn(
        "flex aspect-[2/3] w-full items-center justify-center rounded-sm font-serif text-2xl italic",
        tintFor(title),
        className
      )}
      aria-hidden
    >
      {initial}
    </div>
  );
}
