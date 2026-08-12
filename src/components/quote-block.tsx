export function QuoteBlock({ text }: { text: string }) {
  return (
    <p className="whitespace-pre-wrap font-serif text-[17px] italic leading-relaxed text-ink">
      {text}
    </p>
  );
}
